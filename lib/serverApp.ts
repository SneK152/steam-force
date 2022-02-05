import admin from "firebase-admin"
import { App, getApp, getApps } from "firebase-admin/app"

let app: App
if (!getApps().length) {
  app = admin.initializeApp(
    {
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN)),
    },
    "adminapp",
  )
} else {
  app = getApp("adminapp")
}

const db = admin.firestore(app)
export default db
