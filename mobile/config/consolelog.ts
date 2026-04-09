const consolelog = (data:any) => {
    if (process.env.NODE_ENV === 'production') return;
    console.log('development console')
    console.log(data);
    return
}
  
export default consolelog;