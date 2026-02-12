/**
 * 🏔️ Koda Zenith: Auto-Generated via v1.0 Engine
 * Source: FileSystem Walker (Headless Logic + Soulful UI)
 */
import React, { lazy, Suspense } from 'react';

// 🗺️ Route Tree (Compatible with React Router 7 Data API)
export const apexRoutes = [
{
path: '/',
lazy: async () => { 
                const mod = await import('../../src/app/+layout.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            },
loader: async (args) => { const mod = await import('../../src/app/+layout.koda.ts'); const fn = mod.loader || mod.default; return typeof fn === 'function' ? await fn(args) : {}; },
ErrorBoundary: lazy(async () => { 
                const mod = await import('../../src/app/+error.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { default: Component };
            }),
children: [
{
lazy: async () => { 
                const mod = await import('../../src/app/(public)/+layout.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            },
ErrorBoundary: lazy(async () => { 
                const mod = await import('../../src/app/(public)/+error.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { default: Component };
            }),
children: [
{ index: true, lazy: async () => { 
                    const mod = await import('../../src/app/(public)/+page.tsx'); 
                    const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                    return { Component };
                } },
{
path: 'auth',
lazy: async () => { 
                const mod = await import('../../src/app/(public)/auth/+page.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            }
},
{
path: 'blog',
lazy: async () => { 
                const mod = await import('../../src/app/(public)/blog/+page.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            },
loader: async (args) => { const mod = await import('../../src/app/(public)/blog/+page.koda.ts'); const fn = mod.loader || mod.default; return typeof fn === 'function' ? await fn(args) : {}; },
children: [
{
path: 'post',
lazy: async () => { 
                const mod = await import('../../src/app/(public)/blog/post/+page.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            }
}
]
},
{
path: 'demo-tour',
lazy: async () => { 
                const mod = await import('../../src/app/(public)/demo-tour/+page.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            }
},
{
path: 'dx-public',
lazy: async () => { 
                const mod = await import('../../src/app/(public)/dx-public/+page.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            }
},
{
path: 'invite',
lazy: async () => { 
                const mod = await import('../../src/app/(public)/invite/+page.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            }
},
{
path: 'legal',
lazy: async () => { 
                const mod = await import('../../src/app/(public)/legal/+page.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            },
children: [
{
path: 'document',
lazy: async () => { 
                const mod = await import('../../src/app/(public)/legal/document/+page.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            }
}
]
},
{
path: 'pricing',
lazy: async () => { 
                const mod = await import('../../src/app/(public)/pricing/+page.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            }
}
]
},
{
path: 'app',
lazy: async () => { 
                const mod = await import('../../src/app/app/+layout.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            },
loader: async (args) => { const mod = await import('../../src/app/app/+layout.koda.ts'); const fn = mod.loader || mod.default; return typeof fn === 'function' ? await fn(args) : {}; },
ErrorBoundary: lazy(async () => { 
                const mod = await import('../../src/app/app/+error.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { default: Component };
            }),
children: [
{ index: true, lazy: async () => { 
                    const mod = await import('../../src/app/app/+page.tsx'); 
                    const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                    return { Component };
                } },
{
path: 'about',
lazy: async () => { 
                const mod = await import('../../src/app/app/about/+page.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            }
},
{
path: 'changelog',
lazy: async () => { 
                const mod = await import('../../src/app/app/changelog/+page.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            }
},
{
path: 'dashboard',
lazy: async () => { 
                const mod = await import('../../src/app/app/dashboard/+page.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            },
loader: async (args) => { const mod = await import('../../src/app/app/dashboard/+page.koda.ts'); const fn = mod.loader || mod.default; return typeof fn === 'function' ? await fn(args) : {}; }
},
{
path: 'dx-test',
lazy: async () => { 
                const mod = await import('../../src/app/app/dx-test/+page.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            }
},
{
path: 'finance',
lazy: async () => { 
                const mod = await import('../../src/app/app/finance/+page.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            }
},
{
path: 'insights',
lazy: async () => { 
                const mod = await import('../../src/app/app/insights/+page.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            }
},
{
path: 'market',
lazy: async () => { 
                const mod = await import('../../src/app/app/market/+page.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            }
},
{
path: 'onboarding',
lazy: async () => { 
                const mod = await import('../../src/app/app/onboarding/+page.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            }
},
{
path: 'profile',
lazy: async () => { 
                const mod = await import('../../src/app/app/profile/+page.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            }
},
{
path: 'project',
lazy: async () => { 
                const mod = await import('../../src/app/app/project/+page.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            }
},
{
path: 'system',
children: [
{
path: 'dx-app',
lazy: async () => { 
                const mod = await import('../../src/app/app/system/dx-app/+page.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            }
}
]
},
{
path: 'topup',
lazy: async () => { 
                const mod = await import('../../src/app/app/topup/+page.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            }
}
]
},
{
path: 'experiments',
lazy: async () => { 
                const mod = await import('../../src/app/experiments/+layout.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            },
loader: async (args) => { const mod = await import('../../src/app/experiments/+layout.ts'); const fn = mod.loader || mod.default; return typeof fn === 'function' ? await fn(args) : {}; },
children: [
{
path: 'hydration-check',
lazy: async () => { 
                const mod = await import('../../src/app/experiments/hydration-check/+page.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            },
loader: async (args) => { const mod = await import('../../src/app/experiments/hydration-check/+page.koda.ts'); const fn = mod.loader || mod.default; return typeof fn === 'function' ? await fn(args) : {}; }
},
{
path: 'turbo-test',
lazy: async () => { 
                const mod = await import('../../src/app/experiments/turbo-test/+page.zen.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            },
loader: async (args) => { const mod = await import('../../src/app/experiments/turbo-test/+page.koda.ts'); const fn = mod.loader || mod.default; return typeof fn === 'function' ? await fn(args) : {}; }
},
{
path: 'zenith-test',
lazy: async () => { 
                const mod = await import('../../src/app/experiments/zenith-test/+page.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            },
loader: async (args) => { const mod = await import('../../src/app/experiments/zenith-test/+page.koda.ts'); const fn = mod.loader || mod.default; return typeof fn === 'function' ? await fn(args) : {}; }
}
]
},
{
path: 'labs',
lazy: async () => { 
                const mod = await import('../../src/app/labs/+layout.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            },
ErrorBoundary: lazy(async () => { 
                const mod = await import('../../src/app/labs/+error.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { default: Component };
            }),
children: [
{ index: true, lazy: async () => { 
                    const mod = await import('../../src/app/labs/+page.tsx'); 
                    const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                    return { Component };
                } }
]
},
{
path: 'system',
lazy: async () => { 
                const mod = await import('../../src/app/system/+layout.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            },
ErrorBoundary: lazy(async () => { 
                const mod = await import('../../src/app/system/+error.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { default: Component };
            }),
children: [
{
path: 'admin',
lazy: async () => { 
                const mod = await import('../../src/app/system/admin/+page.tsx'); 
                const Component = mod.default || Object.values(mod).find(v => typeof v === 'function');
                return { Component };
            }
}
]
}
]
}
];
