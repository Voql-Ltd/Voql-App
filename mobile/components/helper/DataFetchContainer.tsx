import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import CustomText from './CustomText';

interface DataFetchContainerProps {
  children: React.ReactNode;
  emptyComponent?: React.ReactNode;
  isError?: boolean;
  errorMsg?: string;
  loadingComponent?: React.ReactNode;
  isEmpty?: boolean;
  isLoading?: boolean;
  isCached?: boolean;
  isCachedEnabled?: boolean;
  cacheLoadingComponent?: React.ReactNode;
}

export default function DataFetchContainer({
  children,
  emptyComponent = <Empty />,
  isError,
  errorMsg,
  loadingComponent = <Loading />,
  isEmpty,
  isLoading,
  isCached=false,
  isCachedEnabled = false,
  cacheLoadingComponent = <CacheLoading />
}: DataFetchContainerProps) {
  
  if (isCached && isCachedEnabled) {
    return cacheLoadingComponent;
  }

  if (isLoading) {
    return loadingComponent;
  }

  if (isError) {
    return (
      <View className="py-5 flex-col items-center justify-center">
        <CustomText className="font-semibold text-red-500 text-center">
          {errorMsg || 'Something went wrong. Please check network'}
        </CustomText>
      </View>
    );
  }

  if (isEmpty) {
    return emptyComponent;
  }

  return <>{children}</>;
}

function Loading() {
  return (
    <View className="h-[200px] justify-center items-center">
      <ActivityIndicator size="large" color="#007AFF" />
      {/* <CustomText className="text-gray-600 mt-3">Loading...</CustomText> */}
    </View>
  );
}

function CacheLoading() {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="small" color="#34C759" />
      <CustomText className="text-gray-600 mt-2 text-sm">Loading from cache...</CustomText>
    </View>
  );
}

function Empty() {
  return (
    <View className="flex-1 justify-center items-center">
      <CustomText className="text-gray-400 text-center">No data available</CustomText>
    </View>
  );
}