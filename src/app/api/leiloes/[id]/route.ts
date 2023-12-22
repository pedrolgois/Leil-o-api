import { deleteLeilao, getLeilao } from "@/src/components/lib/data"
import { NextResponse } from "next/server"

export const GET = async (req: Request, res: Response) => {
  const id = req.url.split("/leiloes/")[1];
  try{
    const item = getLeilao(id);
    if(!item) {
      return NextResponse.json({message: 'Leilão not found' }, { status: 404 })
    }
    return NextResponse.json({message: 'Ok' , item })
  }catch (error) {
    return NextResponse.json({ message: 'Error geting the leilão', error }, { status: 200 })
  }
}

export const DELETE = async (req: Request, res: Response) => {
  const id = req.url.split("/leiloes/")[1];
  try{
    const item = deleteLeilao(id);
    if(!item) {
      return NextResponse.json({message: 'Leilão not found' }, { status: 404 })
    }
    return NextResponse.json({message: 'Leilão deleted' , item })
  }catch (error) {
    return NextResponse.json({ message: 'Error deleting the leilão', error }, { status: 500 })
  }
}
