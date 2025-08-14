'use client'
import { NextSeo } from 'next-seo';
import { SEOConfigData } from '../lib/types';

const domain = process.env.NEXT_PUBLIC_DOMAIN as string;

type SEOConfigProps = {
    config?: SEOConfigData
}

const defaultConfig: SEOConfigData = {
    title: 'Lubella – Bienestar íntimo consciente',
    description: 'Productos Lubella para mujer, pañoletas, toallas femeninas, nocturnas, calzones menstruales y más',
    image: `${domain}/imgs/lubella-productos.JPG`,
    url: domain,
    siteName: 'Lubella',
}

export const SEOConfig = ({ config }: SEOConfigProps) => {
    const configData = config || defaultConfig;
    return (
        <NextSeo
          title={configData.title}
          description={configData.description}
          openGraph={{
            url: domain,
            title: configData.title,
            description: configData.description,
            images: [
              { url: configData.image, width: 800, height: 600, alt: configData.title }
            ],
          }}
        />
    )
}