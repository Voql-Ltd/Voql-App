export default function consoleLog(data: any): void {
    if (process.env.NODE_ENV === 'production') return;
    console.log('development console');
    console.log(data);
    return;
}