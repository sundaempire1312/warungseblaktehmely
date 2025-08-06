export async function POST(req) {
    try {
        const body = await req.json();

        const endpoint = process.env.NEXT_PUBLIC_API_PENJUALAN;
        if (!endpoint) {
            throw new Error("ENV 'NEXT_PUBLIC_API_PENJUALAN' tidak ditemukan");
        }

        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const result = await res.json();

        // Jika response bukan status 200
        if (!res.ok || result.success !== true) {
            return Response.json({
                success: false,
                message: result?.message || "Gagal menyimpan data ke Google Sheet",
                data: result?.data || null,
            }, { status: res.status || 500 });
        }

        // console.log(result.data);
        return Response.json({
            success: true,
            message: result.message || "Data berhasil disimpan",
            data: result.data,
        });



    } catch (error) {
        return Response.json({
            success: false,
            message: "Gagal mengirim data ke spreadsheet",
            error: error.toString(),
        }, { status: 500 });
    }
}


export async function GET() {
    try {
        const url = process.env.NEXT_PUBLIC_GET_PENJUALAN;

        if (!url) {
            throw new Error("NEXT_PUBLIC_GET_PENJUALAN belum didefinisikan di .env.local");
        }

        const res = await fetch(url, {
            method: "GET",
        });

        if (!res.ok) {
            throw new Error(`Gagal fetch dari spreadsheet. Status: ${res.status}`);
        }

        const result = await res.json();

        return Response.json(result, { status: 200 });

    } catch (error) {
        console.error("GET Penjualan error:", error);

        return Response.json({
            success: false,
            message: "Gagal mengambil data",
            error: error.message || "Unknown error"
        }, { status: 500 });
    }
}

