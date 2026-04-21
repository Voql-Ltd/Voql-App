import dotenv from 'dotenv';
dotenv.config({ path: ".env.local" });

import cors from "cors";
import express, { Express } from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from 'socket.io';
import connectDB from "./src/configs/database";
import { connectRedis } from './src/configs/redis';
import routes from "./src/routes/api";
import consoleLog from './src/utils/consolelog';
import redisService from './src/services/redisService';
// import { SocketService } from "./src/services/socketService";

const app: Express = express();

app.use(cors({
  origin:'*'
  // origin: ["https://www.use-webbi.com", "https://use-webbi.com", "https://use-webbi.vercel.app"]
}));

app.use(express.urlencoded({ limit: "1000000mb", extended: true }));
app.use(express.json({ limit: "1000000mb" }));

const PORT: number = parseInt(process.env.PORT || "5001", 10);

const addWavHeader = (pcmBuffer: Buffer, sampleRate = 44100, channels = 1, bitDepth = 16) => {
  const header = Buffer.alloc(44);
  const dataSize = pcmBuffer.length;
  
  header.write('RIFF', 0);                          // RIFF identifier
  header.writeUInt32LE(36 + dataSize, 4);           // file size
  header.write('WAVE', 8);                          // WAVE identifier
  header.write('fmt ', 12);                         // format chunk
  header.writeUInt32LE(16, 16);                     // chunk size
  header.writeUInt16LE(1, 20);                      // PCM format
  header.writeUInt16LE(channels, 22);               // channels
  header.writeUInt32LE(sampleRate, 24);             // sample rate
  header.writeUInt32LE(sampleRate * channels * bitDepth / 8, 28); // byte rate
  header.writeUInt16LE(channels * bitDepth / 8, 32); // block align
  header.writeUInt16LE(bitDepth, 34);               // bits per sample
  header.write('data', 36);                         // data chunk
  header.writeUInt32LE(dataSize, 40);               // data size

  return Buffer.concat([header, pcmBuffer]);
};

const startServer = async () => {
  try {
    
    await connectDB();
    await connectRedis();
  
    const server = createServer(app);
    const io = new SocketIOServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    
    routes(app);

    io.on('connection', (socket) => {
      console.log('user connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
      });

      socket.on('audio_chunk', async ({ chunk, channel_info }) => {
        consoleLog('received audio chunk on backend')
        console.log('chunk type:', typeof chunk, 'chunk.data type:', typeof chunk.data);
        console.log('chunk.data keys:', Object.keys(chunk.data));
        console.log({
          first_20_chars: chunk.data.data.substring(0, 20),
          last_20_chars: chunk.data.data.substring(chunk.data.data.length - 20),
          total_length: chunk.data.data.length,
          is_base64: /^[A-Za-z0-9+/=]+$/.test(chunk.data.data.substring(0, 100)),
        });
        // console.log('chunk.data:', chunk.data);
        let fileName = `chunk_${Date.now()}`;
        fileName=`${channel_info.room_id}_${fileName}_${channel_info.user_id}_${channel_info.user_name}`
        
        // Handle different types of chunk.data
        let pcmBuffer: Buffer;
        // Extract audio data from chunk.data.data (base64 string)
        pcmBuffer = Buffer.from(chunk.data.data, 'base64');

        // 2. add WAV header
        const wavBuffer = addWavHeader(pcmBuffer);
        await redisService.setRd(
          fileName,
          wavBuffer,
          60 * 20
        );
        consoleLog({fileName})
        io.emit('new_chunk', { filename: fileName, timestamp: chunk.timestamp });
        // this.io.to(channel_info.room_id).emit('new_chunk', { filename, timestamp: chunk.timestamp });
      });
    });
    
    server.listen(PORT, () => {
      console.log(`Server now running on port ${PORT} with Socket.io`);
    });
  } catch (error: any) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};


startServer();
