// Trust strip — preenche #ts-track com logos duplicadas para loop infinito

export function initClientTicker() {
  const clientes = [
    { src: 'clientes/rede-dor.png',        alt: "Rede D'Or"                    },
    { src: 'clientes/sesc.png',            alt: 'SESC'                         },
    { src: 'clientes/amil.png',            alt: 'AMIL'                         },
    { src: 'clientes/plaza-lounge.png',    alt: 'Plaza Lounge',         lg: true },
    { src: 'clientes/petrobras.png',       alt: 'Petrobras Offshore',   lg: true },
    { src: 'clientes/adonis.png',          alt: 'Restaurante Adonis',   lg: true },
    { src: 'clientes/boliche-barra.png',   alt: 'Boliche Barra Shopping'       },
    { src: 'clientes/marriott.png',        alt: 'Hotel Marriott'               },
    { src: 'clientes/othon.png',           alt: 'Othon Hotéis',         xl: true },
    { src: 'clientes/supermarket.png',     alt: 'Supermarket Supermercados'    },
    { src: 'clientes/guanabara.png',       alt: 'Supermercados Guanabara'      },
    { src: 'clientes/mocellin.png',        alt: 'Mocellin Churrascaria',xl: true },
    { src: 'clientes/novilho-de-ouro.png', alt: 'Novilho de Ouro Churrascaria', lg: true },
    { src: 'clientes/varieta.png',         alt: 'Varieta Restaurante'          },
    { src: 'clientes/aeronautica.png',     alt: 'Aeronáutica',   lg: true },
  ];
  const mkItem = (c) =>
    `<span class="ts-item"><img src="${c.src}" alt="${c.alt}" class="ts-logo${c.xl ? ' ts-logo-xl' : c.lg ? ' ts-logo-lg' : ''}"></span>` +
    `<span class="ts-dot" aria-hidden="true"></span>`;
  const html = clientes.map(mkItem).join('');
  const track = document.getElementById('ts-track');
  if (track) track.innerHTML = html + html;
}
