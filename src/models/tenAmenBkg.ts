// const PREFIX = 'v1:post:'
import { nanoid } from 'nanoid'

declare global {
  interface Crypto {
    randomUUID(): string
  }
}

/*
export type Param = {
  title: string
  body: string
}
*/

export interface TenantAmenityBooking {
  id: string
  userId: string
  dateCreated: string
  tenantId: string
  amenityId: string
  title?: string
  bookingTimeBasic: string
  date: string
  status: string
  totalFee?: number
  currency?: string
  isPaid?: number
  autoCancelTime?: string
  timeSlots?: string
}

// D1 doc: https://developers.cloudflare.com/d1/client-api
export const getById = async (DB: D1Database, id: string, fields?: string)
  : Promise<TenantAmenityBooking | undefined> => {
  if (id == null) throw new Error('Missing parameter: id')

  const stmt = DB.prepare('SELECT * FROM TenantAmenityBookings WHERE id=?').bind(id)
  const result: any = await stmt.first()
  // let user: User
  if (result) {
    if (fields == null) return result;
    const aryReqFields = fields.split(',')
    const props = Object.getOwnPropertyNames(result)
    let newRst: any = {}
    for (let i = 0; i < props.length; ++i) {
      let prop = props[i]
      if (aryReqFields.includes(prop)) {
        newRst[prop] = result[prop]
      }
    }
    return newRst as TenantAmenityBooking
  }
}

export const getAll = async (DB: D1Database, userId: string, fields?: string)
  : Promise<TenantAmenityBooking[] | undefined> => {
  if (userId == null) throw new Error('Missing parameter: userId')

  const resp = await DB.prepare('SELECT * FROM TenantAmenityBookings WHERE userId=?').bind(userId).all()
  if (resp.error != null) throw new Error(resp.error)
  if (resp.results == null || resp.results.length === 0) return []

  if (fields == null) return resp.results as TenantAmenityBooking[]
  let results: any = [];
  for (let i = 0; i < resp.results.length; ++i) {
    let record: any = resp.results[i];
    const aryReqFields = fields.split(',')
    const props = Object.getOwnPropertyNames(record)
    let newRst: any = {}
    for (let i = 0; i < props.length; ++i) {
      let prop = props[i]
      if (aryReqFields.includes(prop)) {
        newRst[prop] = record[prop];
      }
    }
    results.push(newRst)
  }
  return results
}

export const create = async (DB: D1Database, param: any): Promise<TenantAmenityBooking | undefined> => {
  if (param == null) throw new Error('Missing parameters')
  if (param.userId == null) throw new Error('Missing parameter: userId')
  if (param.tenantId == null) throw new Error('Missing parameter: tenantId')
  if (param.amenityId == null) throw new Error('Missing parameter: amenityId')
  if (param.bookingTimeBasic == null) throw new Error('Missing parameter: bookingTimeBasic')
  if (param.date == null) throw new Error('Missing parameter: date')
  if (param.status == null) throw new Error('Missing parameter: status')

  const id: string = nanoid()
  const newRec: TenantAmenityBooking = {
    id: id,
    userId: param.userId,
    dateCreated: new Date().toISOString(),
    tenantId: param.tenantId,
    amenityId: param.amenityId,
    title: param.title,
    bookingTimeBasic: param.bookingTimeBasic,
    date: param.date,
    status: param.status,
    totalFee: param.totalFee,
    currency: param.currency,
    isPaid: param.isPaid,
    autoCancelTime: param.autoCancelTime,
    timeSlots: param.timeSlots,
  }

  const result: any = await DB.prepare('INSERT INTO TenantAmenityBookings(tenantId,amenityId,title,bookingTimeBasic,date,status,totalFee,currency,isPaid,autoCancelTime,timeSlots) VALUES(?,?,?,?,?,?,?,?,?,?,?)').bind(
    newRec.id,
    newRec.userId,
    newRec.dateCreated,
    newRec.tenantId,
    newRec.amenityId,
    newRec.title,
    newRec.bookingTimeBasic,
    newRec.date,
    newRec.status,
    newRec.totalFee,
    newRec.currency,
    newRec.isPaid,
    newRec.autoCancelTime,
    newRec.timeSlots,
  ).run()
  if (!result.success) throw new Error(result)

  return newRec;
}

export const updateById = async (DB: D1Database, id: string, param: any)
  : Promise<boolean> => {
  if (id == null) throw new Error('Missing id!')
  if (param == null) throw new Error('Missing parameters!')

  const stmt = DB.prepare('SELECT * FROM TenantAmenityBookings WHERE id=?').bind(id)
  const record: any = await stmt.first()

  let updValues: string[] = []
  const props = Object.getOwnPropertyNames(record)
  // let newRec: any = {}
  let values: any = []
  for (let i = 0; i < props.length; ++i) {
    let prop = props[i]
    if (param[prop]) {
      updValues.push(`${prop}=?`)
      values.push(record[prop])
    }
  }
  let sql = `UPDATE TenantAmenityBookings SET ${updValues.join(',')} WHERE id=?`
  values.push(id)
  const result: any = await DB.prepare(sql).bind(...values).run()
  // console.log(result)
  if (!result.success) throw new Error(result)

  return true
}

export const deleteById = async (DB: D1Database, id: string)
  : Promise<boolean> => {
  if (id == null) throw new Error('Missing id!')
  const result: any = await DB.prepare('DELETE FROM TenantAmenityBookings WHERE id=?').bind(id).run()
  if (!result.success) throw new Error(result)
  return true
}
