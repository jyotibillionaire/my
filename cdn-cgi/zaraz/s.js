try {
    (function(w, d) {
        zaraz.debug = (cO = "") => {
            document.cookie = `zarazDebug=${cO}; path=/`;
            location.reload()
        };
        window.zaraz._al = function(dG, dH, dI) {
            w.zaraz.listeners.push({
                item: dG,
                type: dH,
                callback: dI
            });
            dG.addEventListener(dH, dI)
        };
        zaraz.preview = (bN = "") => {
            document.cookie = `zarazPreview=${bN}; path=/`;
            location.reload()
        };
        zaraz.i = function(ds) {
            const dt = d.createElement("div");
            dt.innerHTML = unescape(ds);
            const du = dt.querySelectorAll("script");
            for (let dv = 0; dv < du.length; dv++) {
                const dw = d.createElement("script");
                du[dv].innerHTML && (dw.innerHTML = du[dv].innerHTML);
                for (const dx of du[dv].attributes) dw.setAttribute(dx.name, dx.value);
                d.head.appendChild(dw);
                du[dv].remove()
            }
            d.body.appendChild(dt)
        };
        zaraz.f = async function(bT, bU) {
            const bV = {
                credentials: "include",
                keepalive: !0,
                mode: "no-cors"
            };
            if (bU) {
                bV.method = "POST";
                bV.body = new URLSearchParams(bU);
                bV.headers = {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
            return await fetch(bT, bV)
        };
        window.zaraz._p = async dk => new Promise((dl => {
            if (dk) {
                dk.e && dk.e.forEach((dm => {
                    try {
                        new Function(dm)()
                    } catch (dn) {
                        console.error(`Error executing script: ${dm}\n`, dn)
                    }
                }));
                Promise.allSettled((dk.f || []).map((dp => fetch(dp[0], dp[1]))))
            }
            dl()
        }));
        zaraz.pageVariables = {};
        zaraz.__zcl = zaraz.__zcl || {};
        zaraz.track = async function(cP, cQ, cR) {
            return new Promise(((cS, cT) => {
                const cU = {
                    name: cP,
                    data: {}
                };
                for (const cV of [localStorage, sessionStorage]) Object.keys(cV || {}).filter((cX => cX.startsWith("_zaraz_"))).forEach((cW => {
                    try {
                        cU.data[cW.slice(7)] = JSON.parse(cV.getItem(cW))
                    } catch {
                        cU.data[cW.slice(7)] = cV.getItem(cW)
                    }
                }));
                Object.keys(zaraz.pageVariables).forEach((cY => cU.data[cY] = JSON.parse(zaraz.pageVariables[cY])));
                Object.keys(zaraz.__zcl).forEach((cZ => cU.data[`__zcl_${cZ}`] = zaraz.__zcl[cZ]));
                cU.data.__zarazMCListeners = zaraz.__zarazMCListeners;
                //
                cU.data = { ...cU.data,
                    ...cQ
                };
                cU.zarazData = zarazData;
                fetch("/cdn-cgi/zaraz/t", {
                    credentials: "include",
                    keepalive: !0,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(cU)
                }).catch((() => {
                    //
                    return fetch("/cdn-cgi/zaraz/t", {
                        credentials: "include",
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(cU)
                    })
                })).then((function(da) {
                    zarazData._let = (new Date).getTime();
                    da.ok || cT();
                    return 204 !== da.status && da.json()
                })).then((async c$ => {
                    await zaraz._p(c$);
                    "function" == typeof cR && cR()
                })).finally((() => cS()))
            }))
        };
        zaraz.set = function(db, dc, dd) {
            try {
                dc = JSON.stringify(dc)
            } catch (de) {
                return
            }
            prefixedKey = "_zaraz_" + db;
            sessionStorage && sessionStorage.removeItem(prefixedKey);
            localStorage && localStorage.removeItem(prefixedKey);
            delete zaraz.pageVariables[db];
            if (void 0 !== dc) {
                dd && "session" == dd.scope ? sessionStorage && sessionStorage.setItem(prefixedKey, dc) : dd && "page" == dd.scope ? zaraz.pageVariables[db] = dc : localStorage && localStorage.setItem(prefixedKey, dc);
                zaraz.__watchVar = {
                    key: db,
                    value: dc
                }
            }
        };
        for (const {
                m: df,
                a: dg
            } of zarazData.q.filter((({
                m: dh
            }) => ["debug", "set"].includes(dh)))) zaraz[df](...dg);
        for (const {
                m: di,
                a: dj
            } of zaraz.q) zaraz[di](...dj);
        delete zaraz.q;
        delete zarazData.q;
        zaraz.spaPageview = () => {
            zarazData.l = d.location.href;
            zarazData.t = d.title;
            zaraz.pageVariables = {};
            zaraz.__zarazMCListeners = {};
            zaraz.track("__zarazSPA")
        };
        zaraz.fulfilTrigger = function($, ba, bb, bc) {
            zaraz.__zarazTriggerMap || (zaraz.__zarazTriggerMap = {});
            zaraz.__zarazTriggerMap[$] || (zaraz.__zarazTriggerMap[$] = "");
            zaraz.__zarazTriggerMap[$] += "*" + ba + "*";
            zaraz.track("__zarazEmpty", { ...bb,
                __zarazClientTriggers: zaraz.__zarazTriggerMap[$]
            }, bc)
        };
        zaraz._processDataLayer = dz => {
            for (const dA of Object.entries(dz)) zaraz.set(dA[0], dA[1], {
                scope: "page"
            });
            if (dz.event) {
                if (zarazData.dataLayerIgnore && zarazData.dataLayerIgnore.includes(dz.event)) return;
                let dB = {};
                for (let dC of dataLayer.slice(0, dataLayer.indexOf(dz) + 1)) dB = { ...dB,
                    ...dC
                };
                delete dB.event;
                dz.event.startsWith("gtm.") || zaraz.track(dz.event, dB)
            }
        };
        window.dataLayer = w.dataLayer || [];
        const dy = w.dataLayer.push;
        Object.defineProperty(w.dataLayer, "push", {
            configurable: !0,
            enumerable: !1,
            writable: !0,
            value: function(...dD) {
                let dE = dy.apply(this, dD);
                zaraz._processDataLayer(dD[0]);
                return dE
            }
        });
        dataLayer.forEach((dF => zaraz._processDataLayer(dF)));
        zaraz._cts = () => {
            zaraz._timeouts && zaraz._timeouts.forEach((D => clearTimeout(D)));
            zaraz._timeouts = []
        };
        zaraz._rl = function() {
            w.zaraz.listeners && w.zaraz.listeners.forEach((E => E.item.removeEventListener(E.type, E.callback)));
            window.zaraz.listeners = []
        };
        history.pushState = function() {
            try {
                zaraz._rl();
                zaraz._cts && zaraz._cts()
            } finally {
                History.prototype.pushState.apply(history, arguments);
                setTimeout(zaraz.spaPageview, 100)
            }
        };
        history.replaceState = function() {
            try {
                zaraz._rl();
                zaraz._cts && zaraz._cts()
            } finally {
                History.prototype.replaceState.apply(history, arguments);
                setTimeout(zaraz.spaPageview, 100)
            }
        };
        zaraz._c = fd => {
            const {
                event: fe,
                ...ff
            } = fd;
            zaraz.track(fe, { ...ff,
                __zarazClientEvent: !0
            })
        };
        zaraz._syncedAttributes = ["altKey", "clientX", "clientY", "pageX", "pageY", "button"];
        zaraz.__zcl.track = !0;
        zaraz._p({
            "e": ["(function(w,d){(function(){try{let F;\nF||(F=S=>{w.zaraz._al(S,\"click\",(T=>{if(T.isSynthetic)return;const U=Object.assign({textContent:S.textContent},...Array.prototype.slice.call(S.attributes).map((V=>{let W={};W[V.nodeName]=V.nodeValue;return W})));zaraz.fulfilTrigger(\"Ekok\",\"jyra\",U)}))});\nd.querySelectorAll(unescape(\"%23affiliateButton\")).forEach(((X,Y)=>{F(X,Y)}));\n}catch(Z){console.error(\"Zaraz could not apply a click listener\")}})();(function(){try{let F;\nF||(F=S=>{w.zaraz._al(S,\"click\",(T=>{if(T.isSynthetic)return;const U=Object.assign({textContent:S.textContent},...Array.prototype.slice.call(S.attributes).map((V=>{let W={};W[V.nodeName]=V.nodeValue;return W})));zaraz.fulfilTrigger(\"UduR\",\"jyra\",U)}))});\nd.querySelectorAll(unescape(\"%23affiliateButton\")).forEach(((X,Y)=>{F(X,Y)}));\n}catch(Z){console.error(\"Zaraz could not apply a click listener\")}})();(function(){d.querySelectorAll(\"form\").forEach((dq=>{w.zaraz._al(dq,\"submit\",(dr=>{zaraz.fulfilTrigger(\"yKky\",\"tePi\")}))}));})();w.zarazData.executed.push(\"Pageview\");})(window,document)"],
            "f": [
                ["https://alb.reddit.com/rp.gif?event=PageVisit&id=a2_emw07gblw6ez&ts=1715025947341&uuid=7ba093de-59a8-40b3-b5c4-0741ec812343&integration=reddit&opt_out=0&v=rdt_65e23bc4&sh=900&sw=1440", {
                    "mode": "no-cors",
                    "keepalive": true,
                    "credentials": "include"
                }],
                ["https://tr.snapchat.com/cm/i?pid=0b370e40-3772-4f99-8d00-64cd1af82b1d", {
                    "credentials": "include",
                    "keepalive": true,
                    "mode": "no-cors"
                }],
                ["https://tr.snapchat.com/p", {
                    "credentials": "include",
                    "keepalive": true,
                    "mode": "no-cors",
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    "body": "v=1.5&if=false&ts=1715025947341&rf=&pl=https%3A%2F%2Fwww.formidableforty.com%2Fmornings.html&bt=__LIVE__&ev=PAGE_VIEW&m_sl=2679&m_rd=2586&m_pi=1988&m_pl=2018&m_ic=0&pid=0b370e40-3772-4f99-8d00-64cd1af82b1d&u_c1=0de04449-d0b9-4a3e-854d-ea76349da86e"
                }]
            ]
        })
    })(window, document)
} catch (e) {
    throw fetch("/cdn-cgi/zaraz/t"), e;
}