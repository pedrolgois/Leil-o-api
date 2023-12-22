import { Item, getItens, postItem } from "@/src/components/lib/data"
import { NextResponse } from "next/server"

export const GET = async (req: Request, res: Response) => {
  try{
    const itens = await getItens()
    return NextResponse.json({message: 'Ok' , itens })

  } catch (error) {
    return NextResponse.json({ message: 'Error geting the itens', error }, { status: 500 })
  }
}

export const POST = async (req: Request, res: Response) => {
  const {name, description, minimumValue} = await req.json();

  try{
    const item: Item = {
      id: Date.now().toString(),
      name,
      description,
      minimumValue,
      status: 'A venda',
      date: new Date()
    }
    postItem(item);
    return NextResponse.json({message: 'Ok' , item })
  } catch (error) {
    return NextResponse.json({ message: 'Error geting the itens', error }, { status: 500 })
  }
}
