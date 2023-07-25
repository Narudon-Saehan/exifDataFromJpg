import { useState ,useMemo} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import * as piexif from 'piexifjs';
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import cat from './assets/cat.jpg'
function App() {

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ,
  });

  const [center, setCenter] = useState({ lat: 9.519296837452778, lng: 99.93836421870556 })
  const [imgUrl, setImgUrl] = useState(cat)
  const uploadFile =(files)=>{
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = function () {
      try{
        let exif =  piexif.load(reader.result);

        const latitude = exif['GPS'][piexif.GPSIFD.GPSLatitude];
        const latitudeRef = exif['GPS'][piexif.GPSIFD.GPSLatitudeRef];
        const longitude = exif['GPS'][piexif.GPSIFD.GPSLongitude];
        const longitudeRef = exif['GPS'][piexif.GPSIFD.GPSLongitudeRef];
        // console.log("---------------------");
        // console.log(`Latitude: ${latitude} ${latitudeRef}`);
        // console.log(`Longitude: ${longitude} ${longitudeRef}\n`);

        const latitudeMultiplier = latitudeRef == 'N' ? 1 : -1;
        const decimalLatitude = latitudeMultiplier * piexif.GPSHelper.dmsRationalToDeg(latitude);
        const longitudeMultiplier = longitudeRef == 'E' ? 1 : -1;
        const decimalLongitude = longitudeMultiplier * piexif.GPSHelper.dmsRationalToDeg(longitude);
        console.log("Latitude :",decimalLatitude);
        console.log("Longitude :",decimalLongitude);
        const url = `https://www.google.com/maps?q=${decimalLatitude},${decimalLongitude}`;
        console.log(url);
        setCenter({
          lat: decimalLatitude, 
          lng: decimalLongitude
        })
        

      }catch{
        setCenter(undefined)
        alert("เหมือนว่ารูปนี้จะไม่มี exif data นะครับ")
      }finally{
        setImgUrl(URL.createObjectURL(files[0]))
      }
    };
  }

  // const center = useMemo(() => ({ lat: 44, lng: -80 }), []);

  if (!isLoaded) return <div>Loading...</div>;
  return (
    <>
      <h2>ให้กับคนนิสัยไม่ดีชอบแกล้งคนอื่นอิอิ</h2>
      <div className="card">
        <input
          style={{ }}
          type='file'
          onChange={(e)=>uploadFile(e.target.files)}
        />
      </div>
      {imgUrl?<img src={imgUrl} style={{height: "auto", width: "100%" ,objectFit: 'cover'}}/>:<></>}
      {
        center?<>
        <h3>{"Latitude :"+ center.lat}</h3>
        <h3>{"Longitude :" + center.lng} </h3>
        <GoogleMap zoom={13} center={center} mapContainerStyle={{ height: "300px", width: "100%" }}>
          <MarkerF position={center} />
        </GoogleMap>
        
        </>:<></>
      }

    </>
  )
}

export default App
