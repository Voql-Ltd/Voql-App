import { View } from "react-native";

export default function FixedHeight({fixedChildren, afterChildren, spaceBetween = 130}: {fixedChildren: React.ReactNode, afterChildren: React.ReactNode, spaceBetween?: number}) {
    return (
        <View className="relative bg-white h-full">
            <View style={{height: spaceBetween}} className="pt-5 gap-y-6 absolute top-0 left-0 right-0">
                {fixedChildren}
            </View>
            <View style={{paddingTop: spaceBetween+10}} className="">
                {afterChildren}
            </View>
        </View>
    )
}