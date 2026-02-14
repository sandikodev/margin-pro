
import { Hono } from 'hono';
import type { Context, Next } from 'hono';

// Tipe Handler Hono yang benar
type RouteHandler = (c: Context, next: Next) => Response | Promise<Response>;

// Konvensi export method yang didukung
type RouteModule = {
    GET?: RouteHandler;
    POST?: RouteHandler;
    PUT?: RouteHandler;
    DELETE?: RouteHandler;
    PATCH?: RouteHandler;
    default?: Hono; // Support jika user ingin export const app = new Hono()
};

/**
 * Koda Zenith File-System Router
 * Mengubah struktur folder menjadi Hono Router secara otomatis.
 * 
 * @param globResults - Hasil dari import.meta.glob('/src/routes/**\/*.ts', { eager: true })
 * @param basePath - Prefix untuk routes (default: '/')
 */
export function createFileSystemRouter(globResults: Record<string, unknown>, basePath: string = '/') {
    const router = new Hono().basePath(basePath);

    // Sorting: Pastikan rute statis didahulukan daripada dinamis/wildcard
    // contoh: /users/new harus sebelum /users/[id]
    const entries = Object.entries(globResults).sort(([a], [b]) => {
        // Logic: file dengan '[' (dynamic param) harus di bawah file biasa
        const isDynamicA = a.includes('[');
        const isDynamicB = b.includes('[');
        if (isDynamicA && !isDynamicB) return 1;
        if (!isDynamicA && isDynamicB) return -1;
        return a.localeCompare(b);
    });

    for (const [filePath, module] of entries) {
        // Abaikan file .tsx/.jsx karena itu UI Client
        if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) continue;

        const routeMod = module as RouteModule;

        // 1. Normalisasi Path yang Robust
        // Menghapus prefix direktori awal apapun bentuknya
        // Contoh input: "../routes/api/health.ts", "/src/routes/api/health.ts", "./routes/health.ts"

        // Hapus semua folder parent sampai ketemu folder 'routes/'
        let cleanPath = filePath.split('/routes/').pop() || '';

        // Hapus ekstensi
        cleanPath = cleanPath.replace(/\.(ts|tsx|js|jsx)$/, '');

        // Hapus Route Groups (folder dengan kurung)
        cleanPath = cleanPath.replace(/\/\([^)]+\)/g, '');

        // Hapus 'index' di akhir (karena /users/index -> /users)
        cleanPath = cleanPath.replace(/\/index$/, '');

        // Handle dynamic params: [id] -> :id, [...slug] -> :slug*
        cleanPath = cleanPath
            .replace(/\[\.{3}(.*?)\]/g, ':$1*') // [...slug]
            .replace(/\[(.*?)\]/g, ':$1');      // [id]

        let urlPath = basePath + cleanPath;
        // Normalisasi double slash // -> /
        urlPath = urlPath.replace(/\/+/g, '/');
        // Hapus trailing slash jika bukan root
        if (urlPath !== '/' && urlPath.endsWith('/')) {
            urlPath = urlPath.slice(0, -1);
        }

        if (urlPath === '') urlPath = '/';

        // 2. Register Handlers
        console.log(`[Koda FS] Mounting: ${urlPath} -> ${filePath}`);

        if (routeMod.GET) router.get(urlPath, routeMod.GET);
        if (routeMod.POST) router.post(urlPath, routeMod.POST);
        if (routeMod.PUT) router.put(urlPath, routeMod.PUT);
        if (routeMod.DELETE) router.delete(urlPath, routeMod.DELETE);
        if (routeMod.PATCH) router.patch(urlPath, routeMod.PATCH);

        // 3. Support Full Hono App Export (Advanced)
        // export default new Hono().get(...)
        if (routeMod.default instanceof Hono) {
            router.route(urlPath, routeMod.default);
        }

        console.log(`[Koda FS] Routed: ${urlPath}`);
    }

    return router;
}
