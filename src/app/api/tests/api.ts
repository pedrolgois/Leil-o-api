import { NextResponse } from 'next/server';
import { Item, getItens, postItem, getItem, deleteItem } from "../../../lib/data"

export async function GET() {
    const response = await getItens();
    return response;
}

export async function POST() {
    const item : Item = {
        id: Date.now().toString(),
        status: "",
        date: new Date(),
        name: "teste",
        minimumValue: 1000,
        description: "Produto teste"
    }
    postItem(item);
    return "ok";
}

export async function GET_ID() {
    const response = await getItem("15");
    return response;
}