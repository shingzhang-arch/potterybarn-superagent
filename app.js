// PB Super Agent - Architecture Explorer
// Core JavaScript Logic

const UTTERANCES = [
  {
    id: 'u1',
    label: 'Bed frame comparison',
    text: '"Which bed frame is better for a master bedroom - the Toulouse or the Lorraine?"',
    entryBrand: 'PB',
    brand: 'PB', brandConf: 98,
    intent: 'product comparison', intentConf: 95,
    signals: [{ label: 'PB (98%)', cls: 'chip-brand' }, { label: 'product comparison', cls: 'chip-intent' }],
    routing: { specialist: 'Discovery', subagent: 'Help me choose', confidence: 94 },
    routingReason: 'Two named SKUs + "which is better" = product comparison. Routes to Discovery - Help Me Choose.',
    highlightLayer: 'discovery', highlightCard: 'choose',
    highlights: { brand: 'pb-brand', specialist: 'spec-discovery', subagent: 'choose', ui: 'pb-ui' }
  },
  {
    id: 'u2',
    label: 'Baby shower gift',
    text: '"I need a gift for my sister\'s baby shower - budget around $150"',
    entryBrand: 'PBK',
    brand: 'PBK', brandConf: 88,
    intent: 'gift discovery', intentConf: 91,
    signals: [{ label: 'PBK (88%)', cls: 'chip-brand-pbk' }, { label: 'gift discovery', cls: 'chip-intent' }],
    routing: { specialist: 'Discovery', subagent: 'Gifting guide', confidence: 90 },
    routingReason: 'Life-event signal + explicit budget. Brand resolved to PBK. Routes to Discovery - Gifting Guide.',
    highlightLayer: 'discovery', highlightCard: 'gift',
    highlights: { brand: 'pbk', specialist: 'spec-discovery', subagent: 'gift', ui: 'pbk-ui' }
  },
  {
    id: 'u3',
    label: 'Lost couch order',
    text: '"Where is my order? I was supposed to get my couch last Tuesday."',
    entryBrand: 'PB',
    brand: 'PB', brandConf: 80,
    intent: 'order anxiety', intentConf: 99,
    signals: [{ label: 'PB (80%)', cls: 'chip-brand' }, { label: 'order anxiety', cls: 'chip-intent' }, { label: 'auth required', cls: 'chip-auth' }],
    routing: { specialist: 'Order tracking', subagent: 'Auth - Order status', confidence: 99 },
    routingReason: '"Where is my order" is unambiguous post-purchase signal. Auth required. Routes to Order Tracking.',
    highlightLayer: 'ordertracking', highlightCard: 'auth',
    highlights: { brand: 'pb-brand', specialist: 'spec-ordertracking', subagent: 'auth', ui: 'pb-ui' }
  },
  {
    id: 'u4',
    label: 'Teen room design',
    text: '"Can you help me design my teen\'s room? She loves coastal boho."',
    entryBrand: 'PBT',
    brand: 'PBT', brandConf: 92,
    intent: 'design inspiration', intentConf: 88,
    signals: [{ label: 'PBT (92%)', cls: 'chip-brand-pbt' }, { label: 'design exploration', cls: 'chip-intent' }],
    routing: { specialist: 'Discovery', subagent: 'Lightweight design agent', confidence: 88 },
    routingReason: 'Style-led open exploration. "Teen\'s room" resolves to PBT. Routes to Discovery - Design Agent.',
    highlightLayer: 'discovery', highlightCard: 'design',
    highlights: { brand: 'pbt', specialist: 'spec-discovery', subagent: 'design', ui: 'pbt-ui' }
  },
  {
    id: 'u5',
    label: 'Return a rug',
    text: '"I want to return my rug - it looks nothing like it did online."',
    entryBrand: 'PB',
    brand: 'PB', brandConf: 85,
    intent: 'return intent', intentConf: 96,
    signals: [{ label: 'PB (85%)', cls: 'chip-brand' }, { label: 'return intent', cls: 'chip-intent' }, { label: 'auth required', cls: 'chip-auth' }],
    routing: { specialist: 'Post-order', subagent: 'Return flow', confidence: 96 },
    routingReason: 'Explicit return intent + emotional signal. Routes to Post-Order - Return.',
    highlightLayer: 'postorder', highlightCard: 'return',
    highlights: { brand: 'pb-brand', specialist: 'spec-postorder', subagent: 'return', ui: 'pb-ui' }
  },
  {
    id: 'u6',
    label: 'Menu planning reroute to WS',
    text: '"What should I cook for six people, mostly vegetarian?"',
    entryBrand: 'PB',
    brand: 'WS', brandConf: 86,
    intent: 'recipe/menu planning', intentConf: 95,
    signals: [{ label: 'Williams-Sonoma (86%)', cls: 'chip-brand' }, { label: 'recipe/menu planning', cls: 'chip-intent' }],
    routing: { specialist: 'Discovery', subagent: 'Recipe / Menu', confidence: 94 },
    routingReason: 'Menu-planning intent triggers reroute from entry brand to Williams-Sonoma Discovery - Recipe / Menu.',
    highlightLayer: 'discovery', highlightCard: 'recipe-menu',
    highlights: { specialist: 'spec-discovery', subagent: 'recipe-menu', ui: 'ws-ui' }
  },
  {
    id: 'u7',
    label: 'West Elm style pairing',
    text: '"Can you pair this sofa with a rug and side table?"',
    entryBrand: 'WSE',
    brand: 'WSE', brandConf: 90,
    intent: 'style pairing', intentConf: 87,
    signals: [{ label: 'west elm (90%)', cls: 'chip-brand' }, { label: 'style pairing', cls: 'chip-intent' }],
    routing: { specialist: 'Discovery', subagent: 'Pair it for me', confidence: 86 },
    routingReason: 'Entry context resolves to west elm. Routes to shared Discovery - Pair It For Me.',
    highlightLayer: 'discovery', highlightCard: 'pair',
    highlights: { specialist: 'spec-discovery', subagent: 'pair', ui: 'wse-ui' }
  }
];

const BRAND_RULES = {
  PB: { label: 'Pottery Barn', cls: 'chip-brand' },
  PBK: { label: 'PB Kids', cls: 'chip-brand-pbk' },
  PBT: { label: 'PB Teen', cls: 'chip-brand-pbt' },
  WS: { label: 'Williams-Sonoma', cls: 'chip-brand' },
  WSE: { label: 'west elm', cls: 'chip-brand' },
  MG: { label: 'Mark and Graham', cls: 'chip-brand' }
};

const BRAND_CAPABILITIES = {
  PB: { sharedDiscovery: true, wsRecipeMenu: false },
  PBK: { sharedDiscovery: true, wsRecipeMenu: false },
  PBT: { sharedDiscovery: true, wsRecipeMenu: false },
  WS: { sharedDiscovery: true, wsRecipeMenu: true },
  WSE: { sharedDiscovery: true, wsRecipeMenu: false },
  MG: { sharedDiscovery: true, wsRecipeMenu: false }
};

const LAYERS = [
  { id: 'overview', label: 'Full architecture', sub: 'All layers at a glance', dot: '#888780' },
  { id: 'orchestrator', label: 'Reasoning Engine', sub: 'Built-in reasoning - intent + routing', dot: '#534AB7' },
  { id: 'brand', label: 'Brand layer', sub: 'Persona injection - NEW', dot: '#D4537E', isNew: true },
  { id: 'discovery', label: 'Discovery specialist', sub: 'Level 1 - pre-purchase', dot: '#1D9E75' },
  { id: 'faq', label: 'FAQ specialist', sub: 'Level 1 - knowledge Q&A', dot: '#1D9E75' },
  { id: 'checkout', label: 'Checkout specialist', sub: 'Level 1 - transactional', dot: '#1D9E75' },
  { id: 'ordertracking', label: 'Order tracking', sub: 'Level 1 - post-purchase', dot: '#1D9E75' },
  { id: 'postorder', label: 'Post-order specialist', sub: 'Level 1 - service flows', dot: '#1D9E75' },
  { id: 'ui', label: 'UI / render layer', sub: 'Brand display rules - NEW', dot: '#378ADD', isNew: true },
  { id: 'data', label: 'Data layer', sub: 'Shared sources + tools', dot: '#D85A30' },
  { id: 'human', label: 'Human escalation', sub: 'Designed exit, not fallback', dot: '#BA7517' }
];

let activeLayer = 'overview';
let activeUtt = null;
let activeVersion = 'v2';
let currentEntryBrand = 'PB';

let conversationTurns = [];
let activeTurnIndex = -1;

const CARD_TO_ACCORDION = {
  'auth': 'acc-ordertracking', 'orderstatus': 'acc-ordertracking',
  'easy': 'acc-discovery', 'choose': 'acc-discovery', 'pair': 'acc-discovery',
  'design': 'acc-discovery', 'gift': 'acc-discovery', 'recipe-menu': 'acc-discovery',
  'pip': 'acc-faq', 'policy': 'acc-faq', 'promo': 'acc-faq', 'loyalty': 'acc-faq',
  'cart': 'acc-checkout', 'viewcart': 'acc-checkout',
  'cancel': 'acc-postorder', 'return': 'acc-postorder',
  'pb-brand': 'acc-brand', 'pbk': 'acc-brand', 'pbt': 'acc-brand',
  'pb-ui': 'acc-ui', 'pbk-ui': 'acc-ui', 'pbt-ui': 'acc-ui', 'ws-ui': 'acc-ui', 'wse-ui': 'acc-ui',
};

function detectBrand(t, entryBrand = 'PB') {
  if (/williams.?sonoma|\bws\b|olive/i.test(t)) return { brand: 'WS', brandConf: 95, brandCls: BRAND_RULES.WS.cls };
  if (/west elm|\bwse\b/i.test(t)) return { brand: 'WSE', brandConf: 90, brandCls: BRAND_RULES.WSE.cls };
  if (/mark and graham|\bmg\b/i.test(t)) return { brand: 'MG', brandConf: 90, brandCls: BRAND_RULES.MG.cls };
  const entry = BRAND_RULES[entryBrand];
  if (entry) return { brand: entryBrand, brandConf: 88, brandCls: entry.cls };
  if (/teen|dorm|pbt|teenager/i.test(t)) return { brand: 'PBT', brandConf: 90, brandCls: BRAND_RULES.PBT.cls };
  if (/baby|nursery|crib|newborn|pbk|shower/i.test(t)) return { brand: 'PBK', brandConf: 88, brandCls: BRAND_RULES.PBK.cls };
  return { brand: 'PB', brandConf: 80, brandCls: BRAND_RULES.PB.cls };
}

function classifyUtterance(text, entryBrand = 'PB') {
  const t = text.toLowerCase();
  const brandMatch = detectBrand(t, entryBrand);
  let brand = brandMatch.brand, brandConf = brandMatch.brandConf, brandCls = brandMatch.brandCls;
  let intent = 'product browsing', intentConf = 70;
  let specialist = 'Discovery', subagent = 'Make shopping easy', confidence = 72;
  let reason = '';
  let highlightLayer = 'discovery', highlightCard = 'easy';
  let auth = '';
  const signals = [];

  let brandCaps = BRAND_CAPABILITIES[brand] || { sharedDiscovery: true, wsRecipeMenu: false };

  if (/where.*order|track.*order|when.*deliver|order.*status|where is my|hasn't arrived/i.test(t)) {
    intent = 'order anxiety'; intentConf = 98; auth = 'auth required';
    specialist = 'Order tracking'; subagent = 'Auth - Order status'; confidence = 97;
    reason = '"Where is my order" pattern detected. Auth required. Routes to Order Tracking.';
    highlightLayer = 'ordertracking'; highlightCard = 'auth';
  } else if (/recipe|menu|ingredients|dinner party|meal plan|olive agent|what should i cook|cook tonight/i.test(t)) {
    const reroutedToWS = !brandCaps.wsRecipeMenu;
    if (!brandCaps.wsRecipeMenu) {
      brand = 'WS';
      brandConf = 86;
      brandCls = BRAND_RULES.WS.cls;
      brandCaps = BRAND_CAPABILITIES[brand];
    }
    intent = 'recipe/menu planning'; intentConf = 95;
    specialist = 'Discovery'; subagent = 'Recipe / Menu'; confidence = 94;
    reason = reroutedToWS
      ? 'Entry brand stays as context, but recipe/menu intent reroutes execution to Williams-Sonoma Discovery - Recipe / Menu.'
      : 'Entry brand and intent both align to Williams-Sonoma, so routing stays on WS Discovery - Recipe / Menu.';
    highlightLayer = 'discovery'; highlightCard = 'recipe-menu';
  } else if (/cancel/i.test(t)) {
    intent = 'cancel intent'; intentConf = 96; auth = 'required';
    specialist = 'Post-order'; subagent = 'Cancel'; confidence = 94;
    reason = 'Cancellation intent detected. Routes to Post-Order - Cancel.';
    highlightLayer = 'postorder'; highlightCard = 'cancel';
  } else if (/return|refund|take back|not what|disappointed|broken|damaged/i.test(t)) {
    intent = 'return/service'; intentConf = 95; auth = 'auth required';
    specialist = 'Post-order'; subagent = 'Return flow'; confidence = 93;
    reason = 'Return intent detected. Routes to Post-Order - Return.';
    highlightLayer = 'postorder'; highlightCard = 'return';
  } else if (/add.*cart|buy|order.*now|purchase|checkout|place.*order/i.test(t)) {
    intent = 'transactional readiness'; intentConf = 93;
    specialist = 'Checkout'; subagent = 'Add to cart'; confidence = 91;
    reason = 'Transactional intent detected. Routes to Checkout specialist.';
    highlightLayer = 'checkout'; highlightCard = 'cart';
  } else if (/which|better|difference|compare|choose between|should i get/i.test(t)) {
    intent = 'product comparison'; intentConf = 91;
    specialist = 'Discovery'; subagent = 'Help me choose'; confidence = 89;
    reason = 'Comparison language detected. Routes to Discovery - Help Me Choose.';
    highlightLayer = 'discovery'; highlightCard = 'choose';
  } else if (/pair|match|goes with|complement|rug.*sofa|sofa.*rug|complete the|look together/i.test(t)) {
    intent = 'style pairing'; intentConf = 88;
    specialist = 'Discovery'; subagent = 'Pair it for me'; confidence = 86;
    reason = 'Pairing intent detected. Routes to shared Discovery - Pair It For Me.';
    highlightLayer = 'discovery'; highlightCard = 'pair';
  } else if (/gift|shower|birthday|housewarming|for someone/i.test(t)) {
    intent = 'gift discovery'; intentConf = 92;
    specialist = 'Discovery'; subagent = 'Gifting guide'; confidence = 90;
    reason = 'Gift signal detected. Routes to Discovery - Gifting Guide.';
    highlightLayer = 'discovery'; highlightCard = 'gift';
  } else if (/registry|register|wedding.*list|baby.*list/i.test(t)) {
    intent = 'registry building'; intentConf = 93;
    specialist = 'Discovery'; subagent = 'Registry + room building'; confidence = 91;
    reason = 'Registry intent detected. Routes to Discovery - Registry sub-agent.';
    highlightLayer = 'discovery'; highlightCard = 'gift';
  } else if (/design|decor|style|mood board|aesthetic|coastal|boho|farmhouse/i.test(t)) {
    intent = 'design inspiration'; intentConf = 87;
    specialist = 'Discovery'; subagent = 'Lightweight design agent'; confidence = 85;
    reason = 'Style-led exploration detected. Routes to shared Discovery - Lightweight Design Agent.';
    highlightLayer = 'discovery'; highlightCard = 'design';
  } else if (/policy|return policy|how long|ship|deliver|assembly|white.glove|monogram|how does.*work/i.test(t)) {
    intent = 'policy/faq'; intentConf = 89;
    specialist = 'FAQ'; subagent = 'Policy + general knowledge'; confidence = 87;
    reason = 'Policy question detected. Routes to FAQ specialist.';
    highlightLayer = 'faq'; highlightCard = 'policy';
  } else if (/made of|material|fabric|care|wash|certif|safe for|jpma|weight limit|dimension|size of|measure/i.test(t)) {
    intent = 'product knowledge'; intentConf = 90;
    specialist = 'FAQ'; subagent = 'PIP Q&A'; confidence = 88;
    reason = 'Product specification question. Routes to FAQ - PIP Q&A.';
    highlightLayer = 'faq'; highlightCard = 'pip';
  } else if (/sale|promo|discount|coupon|code|percent off/i.test(t)) {
    intent = 'promotion inquiry'; intentConf = 91;
    specialist = 'FAQ'; subagent = 'Promotions + offers'; confidence = 89;
    reason = 'Promotion question detected. Routes to FAQ - Promotions.';
    highlightLayer = 'faq'; highlightCard = 'promo';
  } else if (/points|the key|loyalty|reward|tier/i.test(t)) {
    intent = 'loyalty inquiry'; intentConf = 93;
    specialist = 'FAQ'; subagent = 'The Key loyalty'; confidence = 91;
    reason = 'Loyalty program question detected. Routes to FAQ - The Key.';
    highlightLayer = 'faq'; highlightCard = 'loyalty';
  } else if (/new|moving|first|just moved|setting up|starting from scratch|nursery|dorm room|first apartment|kitchen setup|starter kitchen|essentials/i.test(t)) {
    intent = 'life transition'; intentConf = 82;
    specialist = 'Discovery'; subagent = 'Make shopping easy'; confidence = 80;
    reason = brand === 'WS'
      ? 'Starter setup intent on WS. Routes to shared Discovery - Make Shopping Easy with kitchenware-focused tools.'
      : 'Starter setup intent detected. Routes to shared Discovery - Make Shopping Easy.';
    highlightLayer = 'discovery'; highlightCard = 'easy';
  }

  const brandLabel = BRAND_RULES[brand] ? BRAND_RULES[brand].label : brand;
  signals.push({ label: `${brandLabel} (${brandConf}%)`, cls: brandCls });
  signals.push({ label: intent, cls: 'chip-intent' });
  if (auth) signals.push({ label: auth, cls: 'chip-auth' });

  if (!reason) reason = `Detected "${intent}" with ${intentConf}% confidence. Routes to ${specialist} - ${subagent}.`;

  // Derive highlights from brand and highlightCard
  let highlights = {};
  if (specialist === 'Discovery') highlights.specialist = 'spec-discovery';
  else if (specialist === 'FAQ') highlights.specialist = 'spec-faq';
  else if (specialist === 'Checkout') highlights.specialist = 'spec-checkout';
  else if (specialist === 'Order tracking') highlights.specialist = 'spec-ordertracking';
  else if (specialist === 'Post-order') highlights.specialist = 'spec-postorder';
  
  highlights.subagent = highlightCard;
  
  if (brand === 'PB') highlights.ui = 'pb-ui';
  else if (brand === 'PBK') highlights.ui = 'pbk-ui';
  else if (brand === 'PBT') highlights.ui = 'pbt-ui';
  else if (brand === 'WS') highlights.ui = 'ws-ui';
  else if (brand === 'WSE') highlights.ui = 'wse-ui';
  else highlights.ui = 'pb-ui';

  return {
    id: 'custom', label: 'Custom utterance', text: `"${text}"`,
    entryBrand,
    brand, brandConf, intent, intentConf, signals,
    routing: { specialist, subagent, confidence },
    routingReason: reason,
    highlightLayer, highlightCard, highlights
  };
}

function buildExampleList() {
  const el = document.getElementById('exampleList');
  el.innerHTML = UTTERANCES.map(u => `
    <button class="example-btn" id="ex-${u.id}" onclick="selectUtt('${u.id}')">
      <div class="ex-label">${u.label}</div>
      <div class="ex-text">${u.text}</div>
    </button>
  `).join('');
}

function buildLayerNav() {
  // Layer navigation removed - single overview mode only
  // No-op: do not populate layer navigation
}

function setLayer(id) {
  // No-op: layer switching disabled - single overview mode only
  // activeLayer always stays as 'overview'
}

function selectUtt(id) {
  activeUtt = UTTERANCES.find(u => u.id === id);
  if (activeUtt && activeUtt.entryBrand) currentEntryBrand = activeUtt.entryBrand;
  document.querySelectorAll('.example-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`ex-${id}`).classList.add('active');
  document.getElementById('customUtt').value = '';
  addTurn(activeUtt);
  renderUttState();
  renderSessionContext(activeUtt);
  setTimeout(() => activatePath(activeUtt), 100);
}

function analyzeCustom() {
  const text = document.getElementById('customUtt').value.trim();
  if (!text) return;
  document.querySelectorAll('.example-btn').forEach(b => b.classList.remove('active'));
  activeUtt = classifyUtterance(text, currentEntryBrand);
  addTurn(activeUtt);
  renderUttState();
  renderSessionContext(activeUtt);
  setTimeout(() => activatePath(activeUtt), 100);
}

function renderUttState() {
  if (!activeUtt) return;
  const bar = document.getElementById('activeUttBar');
  bar.classList.add('visible');
  document.getElementById('activeUttText').textContent = activeUtt.text;
  const chips = document.getElementById('signalChips');
  chips.innerHTML = activeUtt.signals.map(s => `<span class="chip ${s.cls}">${s.label}</span>`).join('') + '<span class="chip chip-conf">~120ms routing</span>';
  document.getElementById('routingBar').classList.add('visible');
  document.getElementById('routingDest').textContent = `- ${activeUtt.routing.specialist} - ${activeUtt.routing.subagent} (${activeUtt.routing.confidence}% confidence)`;
  document.getElementById('routingReason').textContent = activeUtt.routingReason;
}

function renderSessionContext(utt) {
  const strip = document.getElementById('sessionContextStrip');
  const text = document.getElementById('sessionContextText');
  
  if (!utt) {
    strip.classList.remove('visible');
    return;
  }
  
  let context = [];
  context.push(`Entry brand: ${utt.entryBrand || currentEntryBrand}`);
  context.push(`Resolved brand: ${utt.brand}`);
  context.push(`Intent: ${utt.intent}`);
  context.push(`Specialist: ${utt.routing.specialist}`);
  
  if (conversationTurns.length > 1) {
    context.push(`Turn ${activeTurnIndex + 1} of ${conversationTurns.length}`);
  }
  
  text.textContent = context.join(' • ');
  strip.classList.add('visible');
}

function highlightCard(cardId) {
  document.querySelectorAll('.arch-card.highlighted').forEach(c => c.classList.remove('highlighted'));
  const card = document.getElementById(`card-${cardId}`);
  if (card) {
    card.classList.add('highlighted');
    // Auto-open accordion if on overview and card is in an accordion
    if (activeLayer === 'overview' && CARD_TO_ACCORDION[cardId]) {
      const accordionId = CARD_TO_ACCORDION[cardId];
      const detail = document.getElementById(accordionId);
      if (detail && !detail.classList.contains('open')) {
        toggleAccordion(accordionId);
      }
    }
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function toggleAccordion(id) {
  const detail = document.getElementById(id);
  if (!detail) return;
  detail.classList.toggle('open');
  const card = detail.previousElementSibling;
  if (card && card.classList.contains('arch-card')) {
    card.classList.toggle('accordion-open');
  }
}

function ensureAccordionOpen(id) {
  const detail = document.getElementById(id);
  if (!detail || detail.classList.contains('open')) return;
  toggleAccordion(id);
}

function toggleToolDetail(event, id) {
  event.stopPropagation();
  const detail = document.getElementById(id);
  if (!detail) return;
  detail.classList.toggle('open');
  const icon = event.target.closest('.tools-expand-icon');
  if (icon) {
    icon.classList.toggle('open');
  }
}

function setVersion(version) {
  if (version !== 'v1' && version !== 'v2') return;
  activeVersion = version;
  document.querySelectorAll('.version-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.version === version);
  });
  buildLayerSections();
  if (activeUtt) {
    setTimeout(() => activatePath(activeUtt), 50);
  }
}

function closeAllAccordions() {
  document.querySelectorAll('.accordion-detail.open').forEach(detail => {
    detail.classList.remove('open');
    const card = detail.previousElementSibling;
    if (card && card.classList.contains('arch-card')) {
      card.classList.remove('accordion-open');
    }
  });
}

function renderOrchSignals(utt) {
  // Brand detection
  const brandVal = document.getElementById('sigval-brand');
  if (brandVal) {
    const brandNames = { PB: 'Pottery Barn', PBK: 'PB Kids', PBT: 'PB Teen', WS: 'Williams-Sonoma', WSE: 'west elm', MG: 'Mark and Graham' };
    brandVal.textContent = brandNames[utt.brand] || utt.brand;
    brandVal.className = 'signal-value visible brand-' + utt.brand.toLowerCase();
    document.getElementById('sig-brand').classList.add('resolved');
  }
  document.querySelector('#sig-brand .signal-body').textContent =
    activeVersion === 'v2'
      ? `${utt.brandConf}% confidence. Applied after routing to select brand tone, policy framing, and capability set.`
      : `${utt.brandConf}% confidence — resolved from shopper message and domain signals.`;

  // Intent classification
  const intentVal = document.getElementById('sigval-intent');
  if (intentVal) {
    intentVal.textContent = utt.intent;
    intentVal.className = 'signal-value visible';
    document.getElementById('sig-intent').classList.add('resolved');
  }
  document.querySelector('#sig-intent .signal-body').textContent =
    `${utt.intentConf}% confidence — keywords and context together determine intent.`;

  // Domain category
  const domainVal = document.getElementById('sigval-domain');
  if (domainVal) {
    domainVal.textContent = utt.routing.specialist + ' specialist';
    domainVal.className = 'signal-value visible';
    document.getElementById('sig-domain').classList.add('resolved');
  }
  document.querySelector('#sig-domain .signal-body').textContent =
    activeVersion === 'v2'
      ? `Primary job routes to ${utt.routing.specialist}. Then the selected sub-agent handles execution.`
      : `Routes to ${utt.routing.specialist}. Sub-agent: ${utt.routing.subagent}.`;

  // Auth state
  const authRequired = utt.signals.some(s => s.label === 'auth required');
  const authVal = document.getElementById('sigval-auth');
  if (authVal) {
    authVal.textContent = authRequired ? 'Auth required' : 'No auth required';
    authVal.className = 'signal-value visible';
    document.getElementById('sig-auth').classList.add('resolved');
  }
  document.querySelector('#sig-auth .signal-body').textContent =
    authRequired ? 'Identity verification needed before data is shown.' : 'Session context sufficient for this request.';

  // Session context
  const turnNum = conversationTurns.length;
  const sessionVal = document.getElementById('sigval-session');
  if (sessionVal) {
    sessionVal.textContent = turnNum > 1 ? `Turn ${turnNum} — prior context loaded` : 'Fresh session — turn 1';
    sessionVal.className = 'signal-value visible';
    document.getElementById('sig-session').classList.add('resolved');
  }
  document.querySelector('#sig-session .signal-body').textContent =
    turnNum > 1 ? `${turnNum - 1} prior turn(s) in context. Brand and intent history carried forward.` : 'No prior context. Shopper context established this turn.';

  // Multi-intent
  const multiVal = document.getElementById('sigval-multi');
  if (multiVal) {
    multiVal.textContent = 'Single intent detected';
    multiVal.className = 'signal-value visible';
    document.getElementById('sig-multi').classList.add('resolved');
  }
  document.querySelector('#sig-multi .signal-body').textContent =
    'One specialist required for this utterance.';

  // Guardrails
  const grVal = document.getElementById('sigval-guardrails');
  if (grVal) {
    grVal.textContent = 'All guardrails applied';
    grVal.className = 'signal-value visible';
    document.getElementById('sig-guardrails').classList.add('resolved');
  }
  document.querySelector('#sig-guardrails .signal-body').textContent =
    'Conversational engagement, data grounding, safety compliance, premature ending prevention.';
}

function activatePath(utt) {
  // 1. Clear all previous highlights
  document.querySelectorAll('.arch-card.highlighted, .arch-card.path-active, .arch-card.manual-focus')
    .forEach(c => {
      c.classList.remove('highlighted');
      c.classList.remove('path-active');
      c.classList.remove('manual-focus');
    });

  if (!utt.highlights) return;

  // 2. Reasoning Engine — always path-active + open its accordion + update signals
  const orchCard = document.getElementById('card-orch');
  if (orchCard) {
    orchCard.classList.add('path-active');
    ensureAccordionOpen('acc-orchestrator');
  }
  renderOrchSignals(utt);

  // 3. Brand card — path-active + open acc-brand
  const brandCard = document.getElementById(`card-${utt.highlights.brand}`);
  if (brandCard) { 
    brandCard.classList.add('path-active'); 
    ensureAccordionOpen('acc-brand'); 
  }

  // 4. Specialist card — path-active (no accordion open for the row itself)
  const specCard = document.getElementById(`card-${utt.highlights.specialist}`);
  if (specCard) specCard.classList.add('path-active');

  // 5. Sub-agent card — highlighted (full purple) + open its specialist accordion
  const subCard = document.getElementById(`card-${utt.highlights.subagent}`);
  if (subCard) {
    subCard.classList.add('highlighted');
    const accId = CARD_TO_ACCORDION[utt.highlights.subagent];
    if (accId) ensureAccordionOpen(accId);
    if (activeVersion === 'v2') {
      document.querySelectorAll('.tools-detail.open').forEach(d => d.classList.remove('open'));
      document.querySelectorAll('.tools-expand-icon.open').forEach(i => i.classList.remove('open'));
      const firstTool = subCard.querySelector('.tools-detail');
      const firstToolIcon = subCard.querySelector('.tools-expand-icon');
      if (firstTool) firstTool.classList.add('open');
      if (firstToolIcon) firstToolIcon.classList.add('open');
    }
    subCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // 6. UI card — path-active + open acc-ui
  const uiCard = document.getElementById(`card-${utt.highlights.ui}`);
  if (uiCard) { 
    uiCard.classList.add('path-active'); 
    ensureAccordionOpen('acc-ui'); 
  }
}

function handleCardExplorationClick(event) {
  const card = event.target.closest('.arch-card[id^="card-"]');
  if (!card) return;
  if (event.target.closest('.tools-expand-icon')) return;

  const cardId = card.id.replace('card-', '');
  const accId = CARD_TO_ACCORDION[cardId];
  if (accId) ensureAccordionOpen(accId);

  document.querySelectorAll('.arch-card.manual-focus').forEach(node => node.classList.remove('manual-focus'));
  if (!card.classList.contains('highlighted')) {
    card.classList.add('manual-focus');
  }
}

function addTurn(utt) {
  const turn = {
    id: conversationTurns.length + 1,
    label: utt.label || 'Custom utterance',
    utt: utt
  };
  conversationTurns.push(turn);
  activeTurnIndex = conversationTurns.length - 1;
  renderTurnList();
}

function selectTurn(index) {
  activeTurnIndex = index;
  activeUtt = conversationTurns[index].utt;
  renderTurnList();
  renderUttState();
  renderSessionContext(activeUtt);
  setTimeout(() => activatePath(activeUtt), 100);
}

function clearTurns() {
  conversationTurns = [];
  activeTurnIndex = -1;
  activeUtt = null;
  renderTurnList();
  document.getElementById('activeUttBar').classList.remove('visible');
  document.getElementById('routingBar').classList.remove('visible');
  document.getElementById('turnSection').style.display = 'none';
  document.querySelectorAll('.arch-card.highlighted').forEach(c => c.classList.remove('highlighted'));
  document.querySelectorAll('.arch-card.path-active').forEach(c => c.classList.remove('path-active'));
  // Reset all signal cards to their default state
  document.querySelectorAll('.signal-card').forEach(c => c.classList.remove('resolved'));
  document.querySelectorAll('.signal-value').forEach(v => { v.textContent = ''; v.className = 'signal-value'; });
  closeAllAccordions();
}

function renderTurnList() {
  const turnSection = document.getElementById('turnSection');
  const turnList = document.getElementById('turnList');
  
  if (conversationTurns.length === 0) {
    turnSection.style.display = 'none';
    return;
  }
  
  turnSection.style.display = 'block';
  turnList.innerHTML = conversationTurns.map((turn, index) => `
    <div class="turn-item ${index === activeTurnIndex ? 'active' : ''}" onclick="selectTurn(${index})">
      <span class="turn-num">Turn ${turn.id}</span>
      <span class="turn-label">${turn.label}</span>
      ${index === activeTurnIndex ? '<span class="turn-active-marker">←</span>' : ''}
    </div>
  `).join('');
}

function buildLayerSections() {
  const html = `
    <div class="layer-section active" id="sec-overview">
      <div class="layer-header"><div class="layer-header-dot" style="background:#888780"></div><h2>Full architecture - All Layers</h2></div>
      <div class="overview-flow">
        <div class="flow-layer">
          <div class="flow-layer-left"><span class="flow-layer-label">Shopper</span></div>
          <div class="flow-layer-right">
            <div class="arch-card"><div class="ac-tag tag-worker">Entry</div><div class="ac-title">Shopper utterance</div><div class="ac-body">Raw message - brand domain signal - session state - auth state</div></div>
          </div>
        </div>
        <div class="flow-layer-connector"><span class="flow-arrow">↓</span>WITH SESSION CONTEXT</div>
        <div class="flow-layer">
          <div class="flow-layer-left"><span class="flow-layer-label">Session Memory</span></div>
          <div class="flow-layer-right">
            <div class="arch-card flow-row-expandable" onclick="toggleAccordion('acc-session')"><div class="ac-tag tag-data">Persistent</div><div class="ac-title">Conversation Memory - Within Session<span class="accordion-chevron">›</span></div><div class="ac-body">Stores turn-by-turn context: brand resolved, intents explored, specialists visited, products viewed, preferences discovered</div></div>
          </div>
        </div>
        <div class="accordion-detail" id="acc-session" style="border-left-color:#8B6F47">
          <div class="card-grid">
            <div class="arch-card"><div class="ac-tag tag-data">Stored</div><div class="ac-title">Brand Resolution</div><div class="ac-body">Which brand (PB/PBK/PBT) is the shopper on? Confidence level and how resolved?</div></div>
            <div class="arch-card"><div class="ac-tag tag-data">Stored</div><div class="ac-title">Exploration History</div><div class="ac-body">Which specialists visited? Which products viewed? Which styles explored? Which search filters applied?</div></div>
            <div class="arch-card"><div class="ac-tag tag-data">Stored</div><div class="ac-title">Intent History</div><div class="ac-body">Prior intents this session. Used to detect multi-intent or repeated intents and adjust routing or depth of engagement.</div></div>
            <div class="arch-card"><div class="ac-tag tag-data">Stored</div><div class="ac-title">Preferences Discovered</div><div class="ac-body">Budget, style aesthetic, room type, product category preferences. Inferred from turns 1, 2, 3...</div></div>
          </div>
        </div>
        <div class="flow-layer-connector"><span class="flow-arrow">↓</span>enters</div>
        <div class="flow-layer">
          <div class="flow-layer-left"><span class="flow-layer-label">Level 0</span></div>
          <div class="flow-layer-right">
            <div class="arch-card flow-row-expandable" id="card-orch" onclick="toggleAccordion('acc-orchestrator')"><div class="ac-tag tag-orch">Reasoning Engine</div><div class="ac-title">Built-in reasoning + routing<span class="accordion-chevron">›</span></div><div class="ac-body">Configured logic evaluates brand context, intent, auth state, and session conditions to choose the next specialist path.</div></div>
          </div>
        </div>
        <div class="accordion-detail" id="acc-orchestrator" style="border-left-color:#534AB7">
          <div class="signals-grid" style="grid-template-columns: 1fr 1fr;">
            <div class="signal-card" id="sig-brand"><div class="signal-num">01</div><div class="signal-title">Brand detection</div><div class="signal-value" id="sigval-brand"></div><div class="signal-body">Which domain is the shopper on? What life-stage signals exist? Ambiguity is flagged and resolved by secondary signals.</div></div>
            <div class="signal-card" id="sig-intent"><div class="signal-num">02</div><div class="signal-title">Intent Classification</div><div class="signal-value" id="sigval-intent"></div><div class="signal-body">Pre-purchase exploration vs transactional readiness vs post-purchase service. Keywords + context together determine intent.</div></div>
            <div class="signal-card" id="sig-domain"><div class="signal-num">03</div><div class="signal-title">Domain Category</div><div class="signal-value" id="sigval-domain"></div><div class="signal-body">Furniture, decor, gear, gifting, registry. Narrows which sub-agent is most relevant.</div></div>
            <div class="signal-card" id="sig-auth"><div class="signal-num">04</div><div class="signal-title">Auth State Check</div><div class="signal-value" id="sigval-auth"></div><div class="signal-body">Order tracking and post-order flows require auth before data shown. Never reveals order info to unverified.</div></div>
            <div class="signal-card" id="sig-session"><div class="signal-num">05</div><div class="signal-title">Session Context</div><div class="signal-value" id="sigval-session"></div><div class="signal-body">What has the shopper told the agent this session? Context must not be lost when switching specialists.</div></div>
            <div class="signal-card" id="sig-multi"><div class="signal-num">06</div><div class="signal-title">Multi-Intent Detection</div><div class="signal-value" id="sigval-multi"></div><div class="signal-body">Detects when a message contains 2+ intents (e.g. "redecorate AND check my order"). Sequences or splits routing accordingly — one specialist per intent.</div></div>
            <div class="signal-card" id="sig-guardrails"><div class="signal-num">07</div><div class="signal-title">Guardrails</div><div class="signal-value" id="sigval-guardrails"></div><div class="signal-body">Conversational engagement rules — data grounding and authenticity — safety and legal compliance — prevent premature conversation endings. Applied before every response.</div></div>
          </div>
        </div>
        <div class="flow-layer-connector"><span class="flow-arrow">↓</span>injects brand token into</div>
        <div class="flow-layer">
          <div class="flow-layer-left"><span class="flow-layer-label">Brand layer</span><span class="flow-layer-new new-pink">NEW</span></div>
          <div class="flow-layer-right">
            <div class="arch-card flow-row-expandable" onclick="toggleAccordion('acc-brand')" style="grid-column:1/4"><div class="ac-tag tag-brand">Brand personas</div><div class="ac-title">Persona injection - Editorial, Reassuring, Peer-adjacent<span class="accordion-chevron">›</span></div></div>
          </div>
        </div>
        <div class="accordion-detail" id="acc-brand" style="border-left-color:#D4537E;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:12px 0 6px 0">
          <div class="arch-card dashed brand-pb" id="card-pb-brand"><div class="ac-tag tag-brand">Pottery Barn</div><div class="ac-title">PB persona</div><div class="ac-body">Editorial - aspirational - design-forward - adult decision-maker</div><div class="ac-pattern">Sophisticated tone. CTAs like "Explore the collection" not "Buy now". Large product imagery. Full design vocabulary. No safety framing needed.</div></div>
          <div class="arch-card dashed brand-pbk" id="card-pbk"><div class="ac-tag tag-brand">PB Kids</div><div class="ac-title">PBK persona</div><div class="ac-body">Reassuring - safety-first - parent is buyer, child is user - certification-aware</div><div class="ac-pattern">Adds safety language, age-range framing, JPMA references to every response. Confident and clear. "Add to registry" CTA prominent. Certification badge visible.</div></div>
          <div class="arch-card dashed brand-pbt" id="card-pbt"><div class="ac-tag tag-brand">PB Teen</div><div class="ac-title">PBT persona</div><div class="ac-body">Peer-adjacent - direct - trend-aware - teen co-decides, parent pays</div><div class="ac-pattern">Dual-audience awareness - speaks to teen, respects parent budget constraint. No registry framing. Room building is the primary job. Casual, visual-first.</div></div>
        </div>
        <div class="flow-layer-connector"><span class="flow-arrow">↓</span>brand-wrapped request routes to</div>
        <div class="flow-layer">
          <div class="flow-layer-left"><span class="flow-layer-label">Level 1</span></div>
          <div class="flow-layer-right">
            <div id="level1-specialists-row" style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px">
              <div class="arch-card flow-row-expandable" id="card-spec-discovery" onclick="toggleAccordion('acc-discovery')"><div class="ac-tag tag-spec">Specialist</div><div class="ac-title">Discovery<span class="accordion-chevron">›</span></div></div>
              <div class="arch-card flow-row-expandable" id="card-spec-faq" onclick="toggleAccordion('acc-faq')"><div class="ac-tag tag-spec">Specialist</div><div class="ac-title">FAQ<span class="accordion-chevron">›</span></div></div>
              <div class="arch-card flow-row-expandable" id="card-spec-checkout" onclick="toggleAccordion('acc-checkout')"><div class="ac-tag tag-spec">Specialist</div><div class="ac-title">Checkout<span class="accordion-chevron">›</span></div></div>
              <div class="arch-card flow-row-expandable" id="card-spec-ordertracking" onclick="toggleAccordion('acc-ordertracking')"><div class="ac-tag tag-spec">Specialist</div><div class="ac-title">Order tracking<span class="accordion-chevron">›</span></div></div>
              <div class="arch-card flow-row-expandable" id="card-spec-postorder" onclick="toggleAccordion('acc-postorder')"><div class="ac-tag tag-spec">Specialist</div><div class="ac-title">Post-order<span class="accordion-chevron">›</span></div></div>
            </div>
          </div>
        </div>
        <div class="accordion-detail" id="acc-discovery" style="border-left-color:#1D9E75">
          <div class="card-grid">
            <div class="arch-card" id="card-easy"><div class="ac-tag tag-worker">Sub-agent A</div><div class="ac-title">Make Shopping Easy</div><div class="ac-body">Gap analysis. 5 essentials for room type, anchor piece first. Triggered by life-transition language: new home, nursery, dorm, first apartment.</div><div class="ac-pattern"><strong>Tools:</strong> Search_For_Products · Search_For_Rooms · Get Product Details · Answers with Knowledge <span class="tools-expand-icon" onclick="toggleToolDetail(event, 'tools-easy')">▼</span></div><div id="tools-easy" class="tools-detail"><div class="tool-item"><strong>Search_For_Products</strong><br>Input: room type, category | Output: 5 essential items | Sources: Product Catalog, Rooms</div><div class="tool-item"><strong>Search_For_Rooms</strong><br>Input: room type (nursery, dorm, etc.) | Output: Room setup collections | Sources: Rooms</div><div class="tool-item"><strong>Get Product Details</strong><br>Input: SKU | Output: Full specs + price + availability | Sources: Product Catalog</div><div class="tool-item"><strong>Answers with Knowledge</strong><br>Input: shopper question | Output: Grounded answer | Sources: All contextual</div></div></div>
            <div class="arch-card" id="card-choose"><div class="ac-tag tag-worker">Sub-agent B</div><div class="ac-title">Help Me Choose</div><div class="ac-body">Qualifying questions - catalog filter - side-by-side comparison. Triggered when 2+ named products or specific constraint appears.</div><div class="ac-pattern"><strong>Tools:</strong> Search_For_Products · Get Product Details · Search_For_Styles · Answers with Knowledge <span class="tools-expand-icon" onclick="toggleToolDetail(event, 'tools-choose')">▼</span></div><div id="tools-choose" class="tools-detail"><div class="tool-item"><strong>Search_For_Products</strong><br>Input: filters, constraints, budget | Output: Array of matching SKUs | Sources: Product Catalog, Style</div><div class="tool-item"><strong>Get Product Details</strong><br>Input: SKU | Output: Full product card | Sources: Catalog, Tips</div><div class="tool-item"><strong>Search_For_Styles</strong><br>Input: style name | Output: Style family products + mood board | Sources: Style+Inspirations</div><div class="tool-item"><strong>Answers with Knowledge</strong><br>Input: comparison question | Output: Grounded comparison | Sources: Catalog specs</div></div></div>
            <div class="arch-card" id="card-pair"><div class="ac-tag tag-worker">Sub-agent C</div><div class="ac-title">Pair It For Me</div><div class="ac-body">Style coordination. One anchor product found, build the full look. Triggered when product in cart and shopper asks about completing room.</div><div class="ac-pattern"><strong>Tools:</strong> Search_For_Products · Search_For_Styles · Get Style Details · Get Product Details <span class="tools-expand-icon" onclick="toggleToolDetail(event, 'tools-pair')">▼</span></div><div id="tools-pair" class="tools-detail"><div class="tool-item"><strong>Search_For_Products</strong><br>Input: style, room context | Output: Complementary products | Sources: Catalog, Style</div><div class="tool-item"><strong>Search_For_Styles</strong><br>Input: anchor product style | Output: Style family products | Sources: Style+Inspirations</div><div class="tool-item"><strong>Get Style Details</strong><br>Input: style ID | Output: Style guide + palette + mood board | Sources: Style</div><div class="tool-item"><strong>Get Product Details</strong><br>Input: SKU | Output: Full specs | Sources: Catalog</div></div></div>
            <div class="arch-card" id="card-design"><div class="ac-tag tag-worker">Sub-agent D</div><div class="ac-title">Lightweight Design Agent</div><div class="ac-body">Style-led open exploration. Funnel: Shop the Room - mood board - human design consult. Always escalates if deeply engaged.</div><div class="ac-pattern"><strong>Tools:</strong> Search_For_Rooms · Search_For_Inspirations · Search_For_Styles · Get Room Details · Get Inspiration Details · Get Style Details · Tips and Techniques <span class="tools-expand-icon" onclick="toggleToolDetail(event, 'tools-design')">▼</span></div><div id="tools-design" class="tools-detail"><div class="tool-item"><strong>Search_For_Rooms</strong><br>Input: style, room type | Output: Room scene collections | Sources: Rooms</div><div class="tool-item"><strong>Search_For_Inspirations</strong><br>Input: mood/aesthetic | Output: Mood board collections | Sources: Inspirations</div><div class="tool-item"><strong>Search_For_Styles</strong><br>Input: style name | Output: Style products + mood board | Sources: Style</div><div class="tool-item"><strong>Get Room Details</strong><br>Input: room ID | Output: Full room layout + shop collection | Sources: Rooms</div><div class="tool-item"><strong>Get Inspiration Details</strong><br>Input: inspiration ID | Output: Full mood board + products | Sources: Inspirations</div><div class="tool-item"><strong>Get Style Details</strong><br>Input: style ID | Output: Style guide + palette | Sources: Style</div><div class="tool-item"><strong>Tips and Techniques</strong><br>Input: design topic | Output: Video + text guide | Sources: Videos+Tips</div></div></div>
            <div class="arch-card" id="card-gift"><div class="ac-tag tag-worker">Sub-agent E</div><div class="ac-title">Gifting Guide + Registry</div><div class="ac-body">Occasion + budget - curated recs. Registry building room-by-room or category-by-category. PBT: no registry, pure room building.</div><div class="ac-pattern"><strong>Tools:</strong> Search for Gifts / Registry · Get Gift Details · Get Product from Registry · Add to Registry · Search_For_Products <span class="tools-expand-icon" onclick="toggleToolDetail(event, 'tools-gift')">▼</span></div><div id="tools-gift" class="tools-detail"><div class="tool-item"><strong>Search for Gifts / Registry</strong><br>Input: occasion, budget | Output: Gift recommendations | Sources: Occasions, Products</div><div class="tool-item"><strong>Get Gift Details</strong><br>Input: gift ID | Output: Gift description + price + occasion tag | Sources: Occasions</div><div class="tool-item"><strong>Get Product from Registry</strong><br>Input: registry ID | Output: Registry items + status | Sources: Occasions, Products</div><div class="tool-item"><strong>Add to Registry</strong><br>Input: product, category | Output: Confirmation + status | Sources: Registry</div><div class="tool-item"><strong>Search_For_Products</strong><br>Input: category, budget | Output: Products | Sources: Catalog</div></div></div>
          </div>
        </div>
        <div class="accordion-detail" id="acc-faq" style="border-left-color:#1D9E75">
          <div class="card-grid cols-2">
            <div class="arch-card" id="card-pip"><div class="ac-tag tag-worker">Sub-agent A</div><div class="ac-title">PIP Q&A - Product Knowledge</div><div class="ac-body">Specs, materials, care instructions, compatibility, age-appropriateness. PBK adds safety certifications, weight limits.</div><div class="ac-pattern"><strong>Tools:</strong> Get Product Details · Answers with Knowledge · Tips and Techniques <span class="tools-expand-icon" onclick="toggleToolDetail(event, 'tools-pip')">▼</span></div><div id="tools-pip" class="tools-detail"><div class="tool-item"><strong>Get Product Details</strong><br>Input: SKU | Output: Full specs + materials + care | Sources: Catalog, Tips</div><div class="tool-item"><strong>Answers with Knowledge</strong><br>Input: product question | Output: Grounded answer | Sources: Catalog, Tips</div><div class="tool-item"><strong>Tips and Techniques</strong><br>Input: care/maintenance topic | Output: Video + text guide | Sources: Videos+Tips</div></div></div>
            <div class="arch-card" id="card-policy"><div class="ac-tag tag-worker">Sub-agent B</div><div class="ac-title">Policy + General Knowledge</div><div class="ac-body">Return windows, shipping timelines, white-glove delivery, assembly services, monogramming. Brand-specific rules vary.</div><div class="ac-pattern"><strong>Tools:</strong> Answers with Knowledge <span class="tools-expand-icon" onclick="toggleToolDetail(event, 'tools-policy')">▼</span></div><div id="tools-policy" class="tools-detail"><div class="tool-item"><strong>Answers with Knowledge</strong><br>Input: policy question | Output: Grounded policy answer | Sources: Promotions+Policy, Brand Context</div></div></div>
            <div class="arch-card" id="card-promo"><div class="ac-tag tag-worker">Sub-agent C</div><div class="ac-title">Promotions + Offers</div><div class="ac-body">Current sale events, promo codes, registry completion discounts. Always pulls live data - never serves stale info.</div><div class="ac-pattern"><strong>Tools:</strong> Answers with Knowledge <span class="tools-expand-icon" onclick="toggleToolDetail(event, 'tools-promo')">▼</span></div><div id="tools-promo" class="tools-detail"><div class="tool-item"><strong>Answers with Knowledge</strong><br>Input: promotion question | Output: Live promo info | Sources: Promotions+Policy data</div></div></div>
            <div class="arch-card" id="card-loyalty"><div class="ac-tag tag-worker">Sub-agent D</div><div class="ac-title">The Key Loyalty</div><div class="ac-body">Points balance, tier status, redemption rules. Requires auth to show personal balance. General tier questions answered without auth.</div><div class="ac-pattern"><strong>Tools:</strong> Answers with Knowledge <span class="tools-expand-icon" onclick="toggleToolDetail(event, 'tools-loyalty')">▼</span></div><div id="tools-loyalty" class="tools-detail"><div class="tool-item"><strong>Answers with Knowledge</strong><br>Input: loyalty question | Output: Points/tier/redemption info | Sources: The Key Loyalty, Brand Context</div></div></div>
          </div>
        </div>
        <div class="accordion-detail" id="acc-checkout" style="border-left-color:#1D9E75">
          <div class="card-grid cols-2">
            <div class="arch-card" id="card-cart"><div class="ac-tag tag-worker">Sub-agent A</div><div class="ac-title">Add to Cart</div><div class="ac-body">Confirm product + customization options, add to cart, surface cart link. For furniture: surface expected delivery window before confirming.</div></div>
            <div class="arch-card" id="card-viewcart"><div class="ac-tag tag-worker">Sub-agent B</div><div class="ac-title">View Cart + Checkout Assist</div><div class="ac-body">Show cart contents, surface incomplete customization options, link to checkout. Surface relevant promotions or registry discounts at this step.</div></div>
          </div>
        </div>
        <div class="accordion-detail" id="acc-ordertracking" style="border-left-color:#1D9E75">
          <div class="card-grid cols-2">
            <div class="arch-card" id="card-auth"><div class="ac-tag tag-worker">Sub-agent A</div><div class="ac-title">Auth + Verification</div><div class="ac-body">If not logged in: verify by zip + order number. Never reveal to unverified sessions. Escalate on failure after 2 attempts.</div></div>
            <div class="arch-card" id="card-orderstatus"><div class="ac-tag tag-worker">Sub-agent B</div><div class="ac-title">Order Status Display</div><div class="ac-body">Order details with product images, order number, delivery date, shipping status, tracking link. For furniture: white-glove window and assembly options.</div></div>
            <div class="arch-card"><div class="ac-tag tag-worker">Sub-agent C</div><div class="ac-title">Error Handling</div><div class="ac-body">API failure, missing order, delivery exception. Never leave shopper without a next step - always surface phone, in-store, or human chat escalation.</div></div>
            <div class="arch-card"><div class="ac-tag tag-worker">Sub-agent D</div><div class="ac-title">Return/Refund Status</div><div class="ac-body">Return request status, refund timeline, tracking for items in transit back. For large furniture: pickup scheduling status.</div></div>
          </div>
        </div>
        <div class="accordion-detail" id="acc-postorder" style="border-left-color:#1D9E75">
          <div class="card-grid">
            <div class="arch-card" id="card-cancel"><div class="ac-tag tag-worker">Sub-agent A</div><div class="ac-title">Cancel</div><div class="ac-body">Guide through cancellation before fulfillment. For custom furniture: surface cancellation window clearly. If past window: route to exchange or return flow.</div></div>
            <div class="arch-card" id="card-return"><div class="ac-tag tag-worker">Sub-agent B</div><div class="ac-title">Return</div><div class="ac-body">Create return request, generate return label. For large furniture: schedule pickup. PB: 30-day window. Photo documentation step for damage claims.</div></div>
            <div class="arch-card"><div class="ac-tag tag-worker">Sub-agent C</div><div class="ac-title">Refund</div><div class="ac-body">Confirm refund to original tender, communicate timeline (3-5 business days). Surface store credit option as alternative.</div></div>
            <div class="arch-card"><div class="ac-tag tag-worker">Sub-agent D</div><div class="ac-title">Exchange</div><div class="ac-body">Return + place new order in one flow. For wrong size, color, or fabric. Shopper shouldn't have to do two separate transactions.</div></div>
            <div class="arch-card"><div class="ac-tag tag-worker">Sub-agent E</div><div class="ac-title">Warranty Claims</div><div class="ac-body">Identify item - diagnose issue - request photo - create case - route to human. Most furniture warranty claims require human judgment. Agent pre-loads the case.</div></div>
          </div>
        </div>
        <div class="flow-layer-connector"><span class="flow-arrow">↓</span>reads from</div>
        <div class="flow-layer">
          <div class="flow-layer-left"><span class="flow-layer-label">Data layer</span></div>
          <div class="flow-layer-right">
            <div class="arch-card flow-row-expandable" onclick="toggleAccordion('acc-data')"><div class="ac-tag tag-data">Shared</div><div class="ac-title">Product catalog - Order API - Data Cloud - The Key loyalty - Brand context - Promos + policy<span class="accordion-chevron">›</span></div></div>
          </div>
        </div>
        <div class="accordion-detail" id="acc-data" style="border-left-color:#D85A30">
          <div class="card-grid cols-2">
            <div class="arch-card"><div class="ac-tag tag-data">Source 1</div><div class="ac-title">Product Catalog</div><div class="ac-body">All SKUs, specs, fabrics, dimensions, safety certifications, age ranges, compatibility. Filtered by brand at query time. PBK filter adds: JPMA cert, age range, weight limit fields.</div></div>
            <div class="arch-card"><div class="ac-tag tag-data">Source 2</div><div class="ac-title">Order API</div><div class="ac-body">Order status, delivery windows, white-glove scheduling, return status, refund status. Auth-gated - only called after identity verification. Never surfaced without confirmed auth.</div></div>
            <div class="arch-card"><div class="ac-tag tag-data">Source 3</div><div class="ac-title">Salesforce Data Cloud</div><div class="ac-body">Session context, real-time personalization signals, in-session behavior. No purchase history in current scope - all personalization is session-based.</div></div>
            <div class="arch-card"><div class="ac-tag tag-data">Source 4</div><div class="ac-title">The Key Loyalty</div><div class="ac-body">Points balance, tier status, redemption rules, registry completion discounts. Auth-gated for personal balance. General program info available without auth.</div></div>
            <div class="arch-card"><div class="ac-tag tag-data">Source 5</div><div class="ac-title">Brand Context Store</div><div class="ac-body">Tone, voice, and logic rules per brand. PB: editorial, aspirational. PBK: reassuring, safety-first. PBT: peer-adjacent, direct. Injected into every specialist system prompt.</div></div>
            <div class="arch-card"><div class="ac-tag tag-data">Source 6</div><div class="ac-title">Promotions + Policy</div><div class="ac-body">Live promo data, return policy rules, shipping timelines. Always live - never served from cached or stale training data. Critical for seasonal sale events.</div></div>
            <div class="arch-card"><div class="ac-tag tag-data">Source 7</div><div class="ac-title">Style + Inspirations</div><div class="ac-body">Curated style families (coastal, farmhouse, modern, etc.), mood board collections, aesthetic tags. Powers Search_For_Styles, Search_For_Inspirations, and Get Style Details actions.</div></div>
            <div class="arch-card"><div class="ac-tag tag-data">Source 8</div><div class="ac-title">Occasions + Collaborations</div><div class="ac-body">Gift occasions (baby shower, wedding, housewarming), life-stage events, and brand/designer collaboration collections. Powers gifting recommendation and registry curations.</div></div>
            <div class="arch-card"><div class="ac-tag tag-data">Source 9</div><div class="ac-title">Rooms</div><div class="ac-body">Room scene data, shop-the-room collections, room type mappings (nursery, teen bedroom, living room). Powers Search_For_Rooms and Get Room Details actions in the Design Agent.</div></div>
            <div class="arch-card"><div class="ac-tag tag-data">Source 10</div><div class="ac-title">Videos + Tips and Techniques</div><div class="ac-body">How-to videos, design technique guides, care instruction content. Powers the Tips and Techniques action used by FAQ and the Lightweight Design Agent.</div></div>
          </div>
        </div>
        <div class="flow-layer-connector"><span class="flow-arrow">↓</span>specialist output passes to</div>
        <div class="flow-layer">
          <div class="flow-layer-left"><span class="flow-layer-label">UI layer</span><span class="flow-layer-new new-blue">NEW</span></div>
          <div class="flow-layer-right">
            <div class="arch-card flow-row-expandable" onclick="toggleAccordion('acc-ui')" style="grid-column:1/4"><div class="ac-tag tag-ui">Brand display rules</div><div class="ac-title">Editorial, Safety-First, Compact layouts<span class="accordion-chevron">›</span></div></div>
          </div>
        </div>
        <div class="accordion-detail" id="acc-ui" style="border-left-color:#378ADD;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:12px 0 6px 0">
          <div class="arch-card dashed brand-pb" id="card-pb-ui"><div class="ac-tag tag-ui">PB Render</div><div class="ac-title">Editorial Layout</div><div class="ac-body">Large editorial imagery - mood board cards - full-bleed product shots - design consultation CTA - style tag chips - sophisticated copy</div><div class="ac-pattern">Tone: sophisticated. CTAs: "Explore the collection" not "Buy now". Generous whitespace. Serif accents in UI.</div></div>
          <div class="arch-card dashed brand-pbk" id="card-pbk-ui"><div class="ac-tag tag-ui">PBK Render</div><div class="ac-title">Safety-First Layout</div><div class="ac-body">Safety badge chips - age-range filter pills - comparison table with certification column - registry checklist format - "grows with child" callout card</div><div class="ac-pattern">Tone: confident and clear. CTAs: "Add to registry" prominent. Safety info always visible without requiring a click.</div></div>
          <div class="arch-card dashed brand-pbt" id="card-pbt-ui"><div class="ac-tag tag-ui">PBT Render</div><div class="ac-title">Compact Layout</div><div class="ac-body">Compact cards - style tag chips (aesthetic labels) - "shop the vibe" format - mood board first - budget filter prominent - shorter copy throughout</div><div class="ac-pattern">Tone: casual, direct. CTAs: visual-first, minimal text. No registry framing. Budget visibility is non-negotiable.</div></div>
          <div class="arch-card dashed" id="card-ws-ui"><div class="ac-tag tag-ui">Williams-Sonoma Render</div><div class="ac-title">Recipe + Kitchenware Layout</div><div class="ac-body">Recipe/menu cards, ingredient bundles, cookware comparison tables, and hosting-ready checklists.</div><div class="ac-pattern">Emphasizes meal planning, prep steps, substitutions, and kitchen task confidence.</div></div>
          <div class="arch-card dashed" id="card-wse-ui"><div class="ac-tag tag-ui">west elm Render</div><div class="ac-title">Modern Styling Layout</div><div class="ac-body">Clean pairings, vignette-style inspiration, and curated furniture + decor combinations.</div><div class="ac-pattern">Emphasizes modern aesthetic discovery with concise, design-forward comparisons.</div></div>
          <div class="arch-card"><div class="ac-tag tag-ui">Output Handling</div><div class="ac-title">Shared Output Pipeline (All Brands)</div><div class="ac-body">Always runs first: converts specialist/tool output into reusable UI building blocks (cards, grids, tables, carousels). Then the brand render layer applies brand-specific presentation rules.</div><div class="ac-pattern"><strong>Flow:</strong> Specialist/tool result -> shared output handling -> selected brand render (PB/PBK/PBT/WS/west elm).</div></div>
        </div>
        <div class="flow-layer-connector"><span class="flow-arrow">↓</span>renders to shopper - escalates when needed to</div>
        <div class="flow-layer">
          <div class="flow-layer-left"><span class="flow-layer-label">Exit</span></div>
          <div class="flow-layer-right">
            <div class="arch-card flow-row-expandable" onclick="toggleAccordion('acc-human')"><div class="ac-tag tag-human">Human handoff</div><div class="ac-title">Design consult - complex claims - auth failure - distress signal - explicit request<span class="accordion-chevron">›</span></div></div>
          </div>
        </div>
        <div class="accordion-detail" id="acc-human" style="border-left-color:#BA7517">
          <div class="card-grid">
            <div class="arch-card"><div class="ac-tag tag-human">Trigger 1</div><div class="ac-title">Design Consultation Handoff</div><div class="ac-body">The Lightweight Design Agent's funnel always ends here for shoppers who engage deeply. Free human design consult is a PB brand differentiator. Agent pre-loads style preferences and shortlisted products.</div></div>
            <div class="arch-card"><div class="ac-tag tag-human">Trigger 2</div><div class="ac-title">Complex Warranty or Damage Claim</div><div class="ac-body">Furniture damage claims require judgment beyond agent scope - photo validation, policy exceptions, replacement logistics. Agent opens the case and pre-populates all fields. Human picks it up warm.</div></div>
            <div class="arch-card"><div class="ac-tag tag-human">Trigger 3</div><div class="ac-title">Auth Failure or Order Not Found</div><div class="ac-body">If identity can't be verified or order can't be located after two attempts, escalate immediately. Never loop the shopper in auth retry. Human can access verification tools the agent cannot.</div></div>
            <div class="arch-card"><div class="ac-tag tag-human">Trigger 4</div><div class="ac-title">Explicit Shopper Request</div><div class="ac-body">"I want to talk to a person" is always honored immediately. No retention attempt. Agent surfaces phone, in-store appointment option, or live chat queue with estimated wait time.</div></div>
            <div class="arch-card"><div class="ac-tag tag-human">Trigger 5</div><div class="ac-title">Emotional Distress Signal</div><div class="ac-body">High-frustration language around a damaged or lost order. Agent acknowledges, de-escalates, and routes to human within 2 exchanges - doesn't try to resolve through more automation.</div></div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.getElementById('layerSections').innerHTML = html;
  if (activeVersion === 'v2') {
    applyV2Transformations();
  }
}

function applyV2Transformations() {
  const title = document.querySelector('#sec-overview .layer-header h2');
  if (title) title.textContent = 'Full architecture - V2 (data-first view)';

  const flow = document.querySelector('#sec-overview .overview-flow');
  if (flow && !document.getElementById('v2-explainer')) {
    const explainer = document.createElement('div');
    explainer.id = 'v2-explainer';
    explainer.className = 'layer-description';
    explainer.style.borderLeftColor = '#534AB7';
    explainer.textContent = 'V2 shows this in plain terms: the reasoning engine (configured inside the agent) starts with entry-brand context, checks shopper intent, then either stays on that brand path or reroutes when intent clearly belongs to another brand (for example, recipe/menu -> Williams-Sonoma).';
    flow.parentNode.insertBefore(explainer, flow);
  }

  const connectors = Array.from(document.querySelectorAll('.flow-layer-connector'));
  const levelOneConnector = connectors.find(conn => conn.textContent.toLowerCase().includes('brand-wrapped request'));
  if (levelOneConnector) {
    levelOneConnector.innerHTML = '<span class="flow-arrow">↓</span>routes request to the right specialist';
  }

  const orchestratorCard = document.getElementById('card-orch');
  if (orchestratorCard) {
    const body = orchestratorCard.querySelector('.ac-body');
    if (body) {
      body.textContent = 'Evaluates configured conditions (intent, entry-brand context, auth, session) to select a specialist path and decide whether to stay in-brand or reroute.';
    }
  }

  const sigGrid = document.querySelector('#acc-orchestrator .signals-grid');
  if (sigGrid) {
    const signalOrder = ['sig-intent', 'sig-domain', 'sig-session', 'sig-auth', 'sig-multi', 'sig-guardrails', 'sig-brand'];
    signalOrder.forEach((id, index) => {
      const card = document.getElementById(id);
      if (!card) return;
      sigGrid.appendChild(card);
      const num = card.querySelector('.signal-num');
      if (num) num.textContent = String(index + 1).padStart(2, '0');
    });
  }
  const brandSignal = document.getElementById('sig-brand');
  if (brandSignal) {
    const sigTitle = brandSignal.querySelector('.signal-title');
    const sigBody = brandSignal.querySelector('.signal-body');
    if (sigTitle) sigTitle.textContent = 'Brand Context';
    if (sigBody) sigBody.textContent = 'Starts with the shopper entry context (which brand they came from), then enables eligible sub-agents/tools for that brand unless intent requires rerouting.';
    brandSignal.classList.add('signal-secondary');
  }
  const domainSignal = document.getElementById('sig-domain');
  if (domainSignal) {
    const t = domainSignal.querySelector('.signal-title');
    if (t) t.textContent = 'Job To Be Done';
  }

  // Remove standalone Brand layer in V2; brand differences are shown inside specialists/tools/data.
  const brandAccordion = document.getElementById('acc-brand');
  if (brandAccordion) {
    const brandLayerRow = brandAccordion.previousElementSibling;
    const brandConnectorRow = brandLayerRow ? brandLayerRow.previousElementSibling : null;
    brandAccordion.remove();
    if (brandLayerRow) brandLayerRow.remove();
    if (brandConnectorRow) brandConnectorRow.remove();
  }

  const specialistCards = document.querySelectorAll('#card-spec-discovery, #card-spec-faq, #card-spec-checkout, #card-spec-ordertracking, #card-spec-postorder');
  specialistCards.forEach(card => {
    const tag = card.querySelector('.ac-tag');
    if (tag) tag.remove();
  });

  const easyCard = document.getElementById('card-easy');
  if (easyCard) {
    const easyBody = easyCard.querySelector('.ac-body');
    const easyPattern = easyCard.querySelector('.ac-pattern');
    const easyDetails = easyCard.querySelector('#tools-easy');
    if (easyBody) {
      easyBody.textContent = 'Shared discovery flow for “help me get started.” Builds a starter plan and essentials list for the brand context (home setup or kitchen setup).';
    }
    if (easyPattern) {
      easyPattern.innerHTML = '<strong>Tools:</strong> Search_For_Products · Get Product Details · Answers with Knowledge <span class="tools-expand-icon" onclick="toggleToolDetail(event, \'tools-easy\')">▼</span>';
    }
    if (easyDetails) {
      easyDetails.innerHTML = '<div class="tool-item"><strong>Search_For_Products</strong><br>Input: shopper goal, constraints, budget | Output: starter essentials list | Sources: Brand catalog</div><div class="tool-item"><strong>Get Product Details</strong><br>Input: SKU | Output: specs + price + availability | Sources: Brand catalog</div><div class="tool-item"><strong>Answers with Knowledge</strong><br>Input: follow-up question | Output: grounded guidance | Sources: Catalog + policy + content</div>';
    }
  }

  const chooseBody = document.querySelector('#card-choose .ac-body');
  if (chooseBody) {
    chooseBody.textContent = 'Clarifies shopper constraints, filters options, and runs side-by-side comparisons. Shared comparison pattern across brands.';
  }
  const pairBody = document.querySelector('#card-pair .ac-body');
  if (pairBody) {
    pairBody.textContent = 'Finds complementary items around an anchor product. Shared pairing pattern across brands (room, table, or kitchen contexts).';
  }
  const designBody = document.querySelector('#card-design .ac-body');
  if (designBody) {
    designBody.textContent = 'Open-ended inspiration flow that can surface room ideas, table styling, or kitchen setup guidance based on brand context.';
  }
  const giftBody = document.querySelector('#card-gift .ac-body');
  if (giftBody) {
    giftBody.textContent = 'Occasion + budget guided discovery pattern. Shared across brands with brand-specific catalog, registry, or gifting rules.';
  }

  const discoveryGrid = document.querySelector('#acc-discovery .card-grid');
  if (discoveryGrid && !document.getElementById('card-recipe-menu')) {
    const wsRecipe = document.createElement('div');
    wsRecipe.className = 'arch-card';
    wsRecipe.id = 'card-recipe-menu';
    wsRecipe.innerHTML = '<div class="ac-tag tag-worker">Sub-agent F (WS only)</div><div class="ac-title">Recipe / Menu</div><div class="ac-body">Brand-specific discovery path for Williams-Sonoma only. Plans meals, recipes, and ingredient bundles based on dietary needs and prep constraints.</div><div class="ac-pattern"><strong>Tools:</strong> Search_Recipes · Build_Menu · Pantry_Check · Build_Shopping_List <span class="tools-expand-icon" onclick="toggleToolDetail(event, \'tools-recipe-menu\')">▼</span></div><div id="tools-recipe-menu" class="tools-detail"><div class="tool-item"><strong>Search_Recipes</strong><br>Input: cuisine, dietary filters, prep time | Output: ranked recipes | Sources: Recipe graph</div><div class="tool-item"><strong>Build_Menu</strong><br>Input: selected recipes, servings | Output: full menu plan | Sources: Recipe graph</div><div class="tool-item"><strong>Pantry_Check</strong><br>Input: pantry items | Output: available vs missing ingredients | Sources: Pantry profile</div><div class="tool-item"><strong>Build_Shopping_List</strong><br>Input: missing ingredients | Output: purchasable list + substitutions | Sources: Grocery + cookware catalog</div></div>';
    discoveryGrid.appendChild(wsRecipe);
  }
  if (discoveryGrid && !document.getElementById('v2-shared-note')) {
    const note = document.createElement('div');
    note.id = 'v2-shared-note';
    note.className = 'arch-card';
    note.style.gridColumn = '1 / -1';
    note.innerHTML = '<div class="ac-tag tag-data">Routing model</div><div class="ac-title">Shared vs brand-specific Discovery sub-agents</div><div class="ac-body">Shared across brands: Make Shopping Easy, Help Me Choose, Pair It For Me, Lightweight Design Agent. Brand-specific example: Recipe / Menu (Williams-Sonoma only). This extends to umbrella brands like west elm and Mark and Graham by enabling shared and/or brand-specific sub-agent sets.</div>';
    discoveryGrid.appendChild(note);
  }

  const dataTitle = document.querySelector('#acc-data .flow-layer-right .ac-title');
  if (dataTitle) {
    dataTitle.textContent = 'Data sources (tools read from these systems)';
  }
  const dataCards = document.querySelectorAll('#acc-data .arch-card');
  if (dataCards.length > 0) {
    dataCards[0].querySelector('.ac-body').textContent = 'General product catalog used by shared discovery sub-agents across brands.';
    dataCards[6].querySelector('.ac-title').textContent = 'Recipe Graph (Williams-Sonoma)';
    dataCards[6].querySelector('.ac-body').textContent = 'Recipes, cuisines, prep times, and ingredient mappings used by the WS-only Recipe / Menu sub-agent.';
    dataCards[8].querySelector('.ac-title').textContent = 'Kitchen + Cookware Catalog (Williams-Sonoma)';
    dataCards[8].querySelector('.ac-body').textContent = 'Cookware and kitchen tools used when recipe/menu flows recommend supporting products.';
  }

  const uiHeader = document.querySelector('#acc-ui').previousElementSibling;
  if (uiHeader) {
    const titleNode = uiHeader.querySelector('.ac-title');
    const bodyNode = uiHeader.querySelector('.ac-body');
    if (titleNode) titleNode.textContent = 'Shopper-facing output layer';
    if (bodyNode) bodyNode.textContent = 'Shared output handling runs for all brands, then the selected brand render card determines final presentation.';
  }

  const humanHeader = document.querySelector('#acc-human').previousElementSibling;
  if (humanHeader) {
    const titleNode = humanHeader.querySelector('.ac-title');
    if (titleNode) titleNode.textContent = 'Targeted human handoff (specific intents only)';
  }
  const humanGrid = document.querySelector('#acc-human .card-grid');
  if (humanGrid) {
    humanGrid.innerHTML = `
      <div class="arch-card"><div class="ac-tag tag-human">Trigger</div><div class="ac-title">Design consultation requested</div><div class="ac-body">Only escalates when shopper explicitly wants specialist design help or design confidence remains low after guided options.</div></div>
      <div class="arch-card"><div class="ac-tag tag-human">Trigger</div><div class="ac-title">High-friction service exception</div><div class="ac-body">Escalates only for complex claims or service exceptions where policy judgment is required.</div></div>
    `;
  }

  // In V2, tools are contextual inside sub-agents; no standalone tool layer.
  document.querySelectorAll('#acc-discovery .tools-detail').forEach(detail => {
    detail.classList.remove('open');
  });
  document.querySelectorAll('.tools-expand-icon.open').forEach(icon => {
    icon.classList.remove('open');
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  buildExampleList();
  buildLayerNav();
  buildLayerSections();
  setVersion('v2');
  setLayer('overview');

  // Keyboard support
  document.getElementById('customUtt').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      analyzeCustom();
    }
  });
  document.getElementById('layerSections').addEventListener('click', handleCardExplorationClick);
});
