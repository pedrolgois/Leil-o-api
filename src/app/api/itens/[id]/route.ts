import { deleteItem, getItem } from "@/src/components/lib/data"
import { NextResponse } from "next/server"

export const GET = async (req: Request, res: Response) => {
  const id = req.url.split("/itens/")[1];
  try{
    const item = getItem(id);
    if(!item) {
      return NextResponse.json({message: 'Item not found' }, { status: 404 })
    }
    return NextResponse.json({message: 'Ok' , item })
  }catch (error) {
    return NextResponse.json({ message: 'Error geting the item', error }, { status: 200 })
  }
}

export const DELETE = async (req: Request, res: Response) => {
  const id = req.url.split("/itens/")[1];
  try{
    const item = deleteItem(id);
    if(!item) {
      return NextResponse.json({message: 'Item not found' }, { status: 404 })
    }
    return NextResponse.json({message: 'Item deleted' , item })
  }catch (error) {
    return NextResponse.json({ message: 'Error deleting the item', error }, { status: 500 })
  }
}
