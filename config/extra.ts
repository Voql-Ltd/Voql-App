import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const mergeClasses=(...inputs: any[]) => {
  return twMerge(clsx(inputs));
}

const commafy = (x: number) => {
    if(!x || typeof x !=='number') return x
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const kFormatter=(num: number)=> {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
  }
  
export { commafy, kFormatter, mergeClasses };