import { ExpoConfig, ConfigContext } from '@expo/config'
import * as dotenv from 'dotenv'

// initialize dotenv
dotenv.config()

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  expo: {
    plugins: [
      [
        '@rnmapbox/maps',
        {
          RNMapboxMapsDownloadToken: process.env.MAPBOX_SECRET_KEY,
        },
      ],
    ],
  },
})
