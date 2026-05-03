import { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: path.resolve("."),
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'scalethumb.leparking.fr' },
      { protocol: 'https', hostname: 'cloud.leparking.fr' },
      { protocol: 'https', hostname: 'finecars.am' },
      { protocol: 'https', hostname: 'www.hyundai.com' },
      { protocol: 'https', hostname: 'www.banyolti.com' },
      { protocol: 'https', hostname: 'media.discordapp.net' },
      { protocol: 'https', hostname: 'maroccarrental.com' },
      { protocol: 'https', hostname: 'www.luxecar24.com' },
      { protocol: 'https', hostname: 's7d1.scene7.com' },
      { protocol: 'https', hostname: 'mkt-vehicleimages-prd.autotradercdn.ca' },
      { protocol: 'https', hostname: 'media.chromedata.com' },
      { protocol: 'https', hostname: 'www.espagnauto.com' },
      { protocol: 'https', hostname: 'dacia.gslmotors.com' },
      { protocol: 'https', hostname: 'chamaluxury.com' },
      { protocol: 'https', hostname: 'kifalstorage.s3.amazonaws.com' },
      { protocol: 'https', hostname: 'locationdevoituresmarrakech.com' },
      { protocol: 'https', hostname: 'd2qldpouxvc097.cloudfront.net' },
      { protocol: 'https', hostname: 'notfycarent.ma' },
      { protocol: 'https', hostname: 'carimages.d2cmedia.ca' },
      { protocol: 'https', hostname: 's3-eu-west-1.amazonaws.com' },
      { protocol: 'https', hostname: 'carprices.ae' },
      { protocol: 'https', hostname: 'image.elite-auto.fr' },
      { protocol: 'https', hostname: 'inwfile.com' },
      { protocol: 'https', hostname: 'media.motoservices.com' },
      { protocol: 'https', hostname: 'www.mercedes-benz.fr' },
      { protocol: 'https', hostname: 'www.peugeot.fr' },
      { protocol: 'https', hostname: 'www.dacia.fr' },
      { protocol: 'https', hostname: 'www.kia.com' },
      { protocol: 'https', hostname: 'www.audi.fr' },
      { protocol: 'https', hostname: 'www.renault.fr' },
      { protocol: 'https', hostname: 'www.ford.fr' },
      { protocol: 'https', hostname: 'bluesky-cogcms.cdn.imgeng.in' },
      { protocol: 'https', hostname: 'utfs.io' },
      { protocol: 'https', hostname: 'sihabicaressaouira.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'www.car-logos.org' },
      { protocol: 'https', hostname: 'www.pngmart.com' },
      { protocol: 'https', hostname: 'logos-world.net' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'assets.invygo.com' },
      { protocol: 'https', hostname: 'static.vecteezy.com' },
      { protocol: 'https', hostname: 'icon2.cleanpng.com' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
      { protocol: 'https', hostname: 'www.sticarz.fr' },
    ],
  },
};

export default nextConfig;
