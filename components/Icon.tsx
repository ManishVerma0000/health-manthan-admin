import Image from "next/image";
export default function Icon() {   
    return (  
        <>
        <div className="flex justify-center">
            <Image src={'/icon.jpeg'} alt="icon image" height={100} width={200}/>
        </div>
        
        </>
    )
 }