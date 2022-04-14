import dbConnect from '../../../lib/dbConnect'
import Connect_4_Players from '../../../models/Connect_4_Players'

export default async function handler(req, res) {
  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const player = await Connect_4_Players.find({}) /* find all the data in our database */
        res.status(200).json({ success: true, data: player })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case 'POST':
      try {
        const player = await Connect_4_Players.create(
          req.body
        ) /* create a new model in the database */
        res.status(201).json({ success: true, data: player })
      } catch (error) {
        res.status(400).json({ success: error })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
