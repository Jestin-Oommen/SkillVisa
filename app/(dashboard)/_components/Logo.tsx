import Image from "next/image";

const Logo = () => {
    return ( 
        <Image
        height={50}
        width={50}
        alt="logo"
        src={"/server.svg"}/>

        
     );
}
 
export default Logo;