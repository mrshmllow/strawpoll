export interface IPoll {
  id: string
  question: string
  single: boolean
  created_at: string
  colour: string
}

export interface IOption {
  id: string
  option: string
  owner: string
  votes: number
}

export interface IVote {
  ip: string
  poll_id: string
  choice: string
}
