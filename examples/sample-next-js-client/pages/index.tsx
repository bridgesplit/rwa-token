import Image from "next/image";
import { previewBannerURL, projectDescription, projectName } from "../scripts/config";
import Head from "next/head";
import { IdentityRegistry } from "../components/identityregistry/identityRegistry";
import { AssetController } from "../components/assetcontroller/assetController";
import SetupProviderComponent from "../components/setup";
import { PolicyEngineTyped } from "../components/policyengine/policyEngineTyped";
import { DataRegistry } from "../components/dataregistry/dataregistry";


export default function Home() {

  return (
    <>
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" type="image/png" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="192x192" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="512x512" href="/favicon.ico" />

        {/* Misc. */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FAF7F2" />
        <meta name="fortmatic-site-verification" content="j93LgcVZk79qcgyo" />

        {/* Primary Meta Tags */}
        <title>{projectName}</title>
        <meta name="title" content={projectName} />
        <meta name="description" content={projectDescription} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/" />
        <meta property="og:title" content={projectName} />
        <meta property="og:description" content={projectDescription} />
        <meta property="og:image" content={previewBannerURL} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="/" />
        <meta property="twitter:title" content={projectName} />
        <meta property="twitter:description" content={projectDescription} />
        <meta property="twitter:image" content={previewBannerURL} />
      </Head>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-black mt-10">RWA Asset Testing Panel</h1>
        <SetupProviderComponent />
        <AssetController />
        <PolicyEngineTyped />
        <IdentityRegistry />
        <DataRegistry />
      </div>
    </>
  )
}
