// VaiJunto — mapa compartilhado (Integração: Yago)
// Leaflet + tiles CARTO/OpenStreetMap. Rota e posições vêm fixas de shared/caronas.js.
(function () {
  const CARRO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 17h14M4 13l2-5a2 2 0 0 1 2-1h8a2 2 0 0 1 2 1l2 5v4H4z"/><circle cx="8" cy="14" r="1"/><circle cx="16" cy="14" r="1"/></svg>';

  VJ.mapa = function (el, opcoes = {}) {
    const map = L.map(el, {
      zoomControl: opcoes.zoom !== false, attributionControl: true,
      scrollWheelZoom: opcoes.interativo !== false, dragging: opcoes.interativo !== false,
      doubleClickZoom: opcoes.interativo !== false, keyboard: opcoes.interativo !== false,
    });
    if (map.zoomControl) map.zoomControl.setPosition("bottomright");
    // Esri Light Gray: não exige chave nem referer (funciona abrindo o HTML direto do disco)
    const esri = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/";
    L.tileLayer(esri + "World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 16, attribution: "Tiles &copy; Esri — Esri, HERE, Garmin, &copy; OpenStreetMap",
    }).addTo(map);
    L.tileLayer(esri + "World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}", { maxZoom: 16 }).addTo(map);

    const rotaLatLng = VJ.ROTA.map((p) => L.latLng(p[0], p[1]));
    const enquadrar = () => {
      const pad = opcoes.padding || [48, 48];
      map.fitBounds(L.latLngBounds(rotaLatLng), { paddingTopLeft: opcoes.paddingTopLeft || pad, paddingBottomRight: pad });
    };
    enquadrar();
    window.addEventListener("resize", () => { map.invalidateSize(); });

    const api = {
      map, enquadrar,
      // Rota desenhada com contorno branco; anima o traço se `animar`
      rota({ animar = true, cor = "#0e1a16" } = {}) {
        const casing = L.polyline(rotaLatLng, { color: "#fff", weight: 10, opacity: 1, lineCap: "round", lineJoin: "round" }).addTo(map);
        const linha = L.polyline(rotaLatLng, { color: cor, weight: 5, opacity: 1, lineCap: "round", lineJoin: "round" }).addTo(map);
        if (animar && !VJ.reduz) {
          [casing, linha].forEach((l) => {
            const p = l.getElement();
            const len = p.getTotalLength();
            gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, {
              strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", delay: 0.3,
              onComplete: () => { p.style.strokeDasharray = ""; },
            });
          });
        }
        return linha;
      },
      // Marcador com HTML livre (classes de base.css: pin-ponto, pin-destino, pin-carro)
      pin(latlng, html, tamanho = [24, 24], z = 0) {
        return L.marker(latlng, {
          icon: L.divIcon({ className: "vj-pin", html, iconSize: tamanho, iconAnchor: [tamanho[0] / 2, tamanho[1] / 2] }),
          keyboard: false, zIndexOffset: z,
        }).addTo(map);
      },
      // rotuloInicio=false quando a tela mostra o pin de embarque (evita rótulos sobrepostos)
      inicioFim({ rotuloInicio = true } = {}) {
        const rotulo = rotuloInicio ? `<span class="pin-label">${VJ.LUGARES[0].nome.split(" —")[0]}</span>` : "";
        const ini = this.pin(rotaLatLng[0], `<div class="pin-ponto"></div>${rotulo}`, [18, 18]);
        const fim = this.pin(rotaLatLng[rotaLatLng.length - 1], `<div class="pin-destino"></div><span class="pin-label">${VJ.LUGARES[1].nome.split(" — ")[1]}</span>`, [22, 22]);
        return { ini, fim };
      },
      carro(i, hue = 158) {
        const m = this.pin(rotaLatLng[i], `<div class="pin-carro" style="--hue:${hue}">${CARRO}</div>`, [40, 40], 1000);
        m.el = () => m.getElement().querySelector(".pin-carro");
        return m;
      },
      // Move marcador pela rota do índice `de` até `ate` (com GSAP)
      andar(marker, de, ate, duracao, extra = {}) {
        const estado = { i: de };
        return gsap.to(estado, {
          i: ate, duration: VJ.reduz ? 0 : duracao, ease: extra.ease || "none", ...extra,
          onUpdate() {
            const k = Math.floor(estado.i), t = estado.i - k;
            const a = rotaLatLng[k], b = rotaLatLng[Math.min(k + 1, rotaLatLng.length - 1)];
            marker.setLatLng([a.lat + (b.lat - a.lat) * t, a.lng + (b.lng - a.lng) * t]);
            extra.aoAndar && extra.aoAndar(estado.i);
          },
        });
      },
      latlng: (i) => rotaLatLng[i],
    };
    return api;
  };
})();
