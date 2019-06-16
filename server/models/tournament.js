import mongoose from "mongoose";
const Schema = mongoose.Schema;

const refTo = schemaName => ({ type: Schema.Types.ObjectId, ref: schemaName })

const schema = new Schema({
  id: { type: String, unique: true},
  // Название турнира
  name: String,
  // Описание турнира
  description: String,
  // Адрес стрима/места, где можно будет увиеть турнир
  url: String, 
  // Обложка?
  imageUrl: String,
  // Дата создания
  createdAt: Date,
  // Предположительное ВРЕМЯ начала и день КОГДА будет проходить турнир
  startAt: Date,
  rewards: [{ rewardId, rewardPositionId }], // во время создания турнира, юзер может указать ID наград (выбрать их из своего инвентаря), после победы, эти награды передаются победителям... каким?
  // Стоимость участия (в долларах) для ЗРИТЕЛЯ который делает ставки, если 0 то бесплатно
  price: {type: Number, min: 0},
  // множитель правила
  rules: {
    type: Map,
    of: Number
  }, 
  isReady: {type: Boolean, default: false},
  winner: refTo('User'),
  creatorId: refTo('User'),
  summoners: [refTo('User')],
  // теперь прежде чем турнир начнется, участники могут "предложить свою кандидатуру" на участие
  applicants: [refTo('User')], 
  // зрители, могут выбрать своих "кандидатов", за достижения призывателей, зрители набирают баллы в соотвествии с rules
  viewers: [{ userId, summoners: [userId] }], 
},
{
  toObject: { virtuals: true },
}
);

export default mongoose.model('Tournament', schema);