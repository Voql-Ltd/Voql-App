import { View } from 'react-native';
// import { ScreenViewContext } from '../../context';
// import { TextInput } from 'react-native';
// import TrxIcon from '../../../assets/web_assets/used/more/trx-icon.svg';
import { API_ROUTES } from '../../config';
import CustomText from './CustomText';

interface ListHelperProps {
  label: string;
  prop1: string;
  fake: keyof typeof API_ROUTES;
  dateProp?: string;
  statusProp?: string;
  priceProp?: string;
}

export default function ListHelper({
  label,
  prop1,
  fake,
  dateProp = 'date',
  statusProp = 'status',
  priceProp = 'amount'
}: ListHelperProps) {
  return (
    <View className='bg-white py-5 rounded-md' style={{boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}}>
      <View className='flex-row items-center px-3 pb-4 border-b border-b-gray-300 gap-x-3'>
        {/* <TrxIcon/> */}
        <CustomText style={{fontFamily:'quicksandbold', fontSize:20}}>{label}</CustomText>
      </View>
      <View className='px-3 flex-col gap-y-3 mt-4'>
        {Array.isArray(API_ROUTES[fake]) && API_ROUTES[fake].map((item: any, ind: number) => (
          <View key={ind} className='flex flex-row justify-between items-center'>
            <View className='flex-col gap-x-[6px]'>
              <CustomText style={{fontFamily:'jakarta'}}>{item[prop1]}</CustomText>
              <CustomText style={{fontFamily:'jakarta', color:'#727272'}} >{item[dateProp]}</CustomText>
            </View>
            <View className='flex-col gap-x-[6px]'>
              <CustomText style={{fontFamily:'jakarta'}}>{item[priceProp]}</CustomText>
              <CustomText style={{fontFamily:'jakarta', 
                ...(item[statusProp]==='pending'?({color:'#727272'}):
                  item[statusProp]==='failed'?({color:'#e53950'}):
                  ({color:'#20c905'})
                )}}>{item[statusProp]}</CustomText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}