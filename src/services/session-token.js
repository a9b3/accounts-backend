import jwt from 'jsonwebtoken'

export function create({
  id,
}) {
  const token = jwt.sign({
    id,
  })
}
