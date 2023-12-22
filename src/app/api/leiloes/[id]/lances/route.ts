import { Lance,  deleteLance, getLeilao, postAddLance } from "@/src/components/lib/data"
import { useRouter } from "next/router";
import { NextResponse } from "next/server"

export const POST = async (req: Request, res: Response) => {
  const {value, participant} = await req.json();
  const router = useRouter();

  try{
    const leilao = await getLeilao(router.query.id as string);
    // Verifica se o leilão existe
    if(!leilao){
      return NextResponse.json({ message: 'Leilão not found' }, { status: 404 })
    }
    // Verifica se o leião está aberto
    if(Date.now() > leilao.horarioLimite.getTime()){
      return NextResponse.json({ message: 'Leilão encerrado' }, { status: 400 })
    }
    // Verifica se o lance é maior que o valor mínimo
    if(value < leilao.item.minimumValue){
      return NextResponse.json({ message: 'Lance menor que o valor mínimo' }, { status: 400 })
    }
    // Verifica se o lance é maior que o maior lance do leilão
    const maiorLance = leilao.lances.reduce((prev, current) => {
      return (prev.value > current.value) ? prev : current
    })
    if(value < maiorLance.value){
      return NextResponse.json({ message: `Lance menor que o maior lance: R$${maiorLance.value}` }, { status: 400 })
    };
    const lance: Lance = {
      id: Date.now().toString(),
      value,
      participant,
      date: new Date()
    }
    postAddLance(leilao.id, lance);
    return NextResponse.json({message: 'Ok' , leilao })
  } catch (error) {
    return NextResponse.json({ message: 'Error creating the lance', error }, { status: 500 })
  }
}

export const DELETE = async (req: Request, res: Response) => {
  const router = useRouter();
  const {lanceId} = await req.json();

  try{
    const leilao = await getLeilao(router.query.id as string);
    // Verifica se o leilão existe
    if(!leilao){
      return NextResponse.json({ message: 'Leilão not found' }, { status: 404 })
    }
    // Verifica se o lance existe
    if(!leilao.lances.find(lance => lance.id === lanceId)){
      return NextResponse.json({ message: 'Lance not found' }, { status: 404 })
    }
    // Verifica se o leião está aberto
    if(leilao.item.status !== 'A venda'){
      return NextResponse.json({ message: 'Leilão encerrado ou não iniciado' }, { status: 400 })
    }

    deleteLance(router.query.id as string, lanceId);
    return NextResponse.json({message: 'Lance deleted' , leilao })
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting the lance', error }, { status: 500 })
  }
}
