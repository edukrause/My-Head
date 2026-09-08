(function () {
    'use strict';

    const display = document.getElementById('display');
    const subdisplay = document.getElementById('subdisplay');
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modal-close');
    const equalsBtn = document.getElementById('btn-equals');
    const yearEl = document.getElementById('year');

    yearEl.textContent = new Date().getFullYear();

    const state = {
        current: '0',
        previous: null,
        operator: null,
        justEvaluated: false,
    };

    const OP_SYMBOL = { '+': '+', '-': '−', '*': '×', '/': '÷' };

    function render() {
        display.textContent = formatForDisplay(state.current);
        if (state.previous !== null && state.operator) {
            subdisplay.textContent = `${formatForDisplay(state.previous)} ${OP_SYMBOL[state.operator]}`;
        } else {
            subdisplay.innerHTML = '&nbsp;';
        }
    }

    function formatForDisplay(value) {
        const str = String(value);
        if (str === '' || str === '-') return '0';
        const [intPart, decPart] = str.replace('-', '').split('.');
        const withSep = Number(intPart).toLocaleString('pt-BR');
        const sign = str.startsWith('-') ? '-' : '';
        return decPart !== undefined ? `${sign}${withSep},${decPart}` : `${sign}${withSep}`;
    }

    function inputDigit(d) {
        if (state.justEvaluated) {
            state.current = '0';
            state.justEvaluated = false;
        }
        if (d === '.') {
            if (!state.current.includes('.')) {
                state.current = state.current === '' ? '0.' : state.current + '.';
            }
        } else if (state.current === '0') {
            state.current = d;
        } else {
            state.current = state.current + d;
        }
        render();
    }

    function setOperator(op) {
        if (state.operator && state.previous !== null && !state.justEvaluated) {
            state.previous = compute(state.previous, state.current, state.operator);
            state.current = state.previous;
        } else {
            state.previous = state.current;
        }
        state.operator = op;
        state.current = '0';
        state.justEvaluated = false;
        render();
    }

    function compute(a, b, op) {
        const x = parseFloat(a);
        const y = parseFloat(b);
        let r = 0;
        switch (op) {
            case '+': r = x + y; break;
            case '-': r = x - y; break;
            case '*': r = x * y; break;
            case '/': r = y === 0 ? NaN : x / y; break;
        }
        return String(Number.isFinite(r) ? +r.toFixed(10) : 'Erro');
    }

    function clearAll() {
        state.current = '0';
        state.previous = null;
        state.operator = null;
        state.justEvaluated = false;
        render();
    }

    function toggleSign() {
        if (state.current === '0') return;
        state.current = state.current.startsWith('-')
            ? state.current.slice(1)
            : '-' + state.current;
        render();
    }

    function applyPercent() {
        const n = parseFloat(state.current);
        if (!isNaN(n)) {
            state.current = String(n / 100);
            render();
        }
    }

    document.querySelectorAll('[data-num]').forEach(btn => {
        btn.addEventListener('click', () => inputDigit(btn.dataset.num));
    });

    document.querySelectorAll('[data-op]').forEach(btn => {
        btn.addEventListener('click', () => setOperator(btn.dataset.op));
    });

    document.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action === 'clear') clearAll();
            else if (action === 'sign') toggleSign();
            else if (action === 'percent') applyPercent();
        });
    });

    equalsBtn.addEventListener('click', openPaywall);

    function openPaywall() {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        startHeadSpin();
    }

    function closePaywall() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        stopHeadSpin();
    }

    modalClose.addEventListener('click', closePaywall);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closePaywall();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) closePaywall();
    });

    document.querySelectorAll('.plan-cta').forEach(btn => {
        btn.addEventListener('click', () => {
            const plan = btn.dataset.plan;
            if (plan === 'free') return;
            btn.textContent = 'Processando pagamento...';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = 'Cartão recusado 😢';
            }, 1200);
        });
    });

    let headTween = null;
    function startHeadSpin() {
        const img = document.getElementById('img');
        if (!img || typeof gsap === 'undefined') return;
        headTween = gsap.to(img, { rotation: '+=3600', duration: 6, ease: 'none', repeat: -1 });
    }
    function stopHeadSpin() {
        if (headTween) {
            headTween.kill();
            headTween = null;
        }
    }

    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('open')) return;
        if (/^\d$/.test(e.key)) inputDigit(e.key);
        else if (e.key === '.' || e.key === ',') inputDigit('.');
        else if (['+', '-', '*', '/'].includes(e.key)) setOperator(e.key);
        else if (e.key === 'Enter' || e.key === '=') openPaywall();
        else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') clearAll();
    });

    render();
})();
