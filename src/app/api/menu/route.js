export async function GET() {
    try {
        const res = await fetch(process.env.NEXT_PUBLIC_MENU);
        const data = await res.json();

        if (!data.success) {
            return Response.json({ success: false, message: data.message || 'Gagal fetch data produk' }, { status: 500 });
        }

        return Response.json({ success: true, produk: data.produk }, { status: 200 });
    } catch (error) {
        return Response.json({ success: false, message: error.message }, { status: 500 });
    }
}
