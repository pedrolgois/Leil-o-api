import { Leilao, getItem, getLeiloes, postLeilao } from "@/src/components/lib/data"
import { NextResponse } from "next/server"

export const GET = async (req: Request, res: Response) => {
  try{
    const leiloes = await getLeiloes()
    return NextResponse.json({message: 'Ok' , leiloes })

  } catch (error) {
    return NextResponse.json({ message: 'Error geting the leiloes', error }, { status: 500 })
  }
}

export const POST = async (req: Request, res: Response) => {
  const {itemId, horarioLimite} = await req.json();
  try{
    const item = await getItem(itemId);

    if(!item){
      return NextResponse.json({ message: 'Item not found' }, { status: 404 })
    }

    const leilao: Leilao = {
      id: Date.now().toString(),
      item,
      lances: [],
      date: new Date(),
      horarioLimite,
    }

    postLeilao(leilao);
    return NextResponse.json({message: 'Ok' , leilao })
  } catch (error) {
    return NextResponse.json({ message: 'Error creating the leilao', error }, { status: 500 })
  }
}
