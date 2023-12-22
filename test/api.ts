import { NextResponse } from 'next/server';
import { Item, getItens, postItem } from "../src/lib/data"

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