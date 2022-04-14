import dbConnect from '../../../lib/dbConnect'
import connect_4_Player from '../../../models/Connect_4_Player'

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req

  await dbConnect()

  switch (method) {
    case 'GET' /* Get a model by its ID */:
      try {
        const player = await connect_4_Player.findById(id)
        if (!player) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: player })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    case 'PUT' /* Edit a model by its ID */:
      try {
        const player = await connect_4_Player.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        })
        if (!player) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: player })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    case 'DELETE' /* Delete a model by its ID */:
      try {
        const deletedPlot = await connect_4_Player.deleteOne({ _id: id })
        if (!deletedPlot) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: {} })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    default:
      res.status(400).json({ success: false })
      break
  }
}
