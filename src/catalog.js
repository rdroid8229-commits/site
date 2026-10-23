import images from './images.json';
const base = import.meta.env.VITE_IMAGE_BASE || '/images/';
export const categories = [
  { id: 'impressoes', name: 'Impressões e cópias', short: 'Impressões e cópias', image: base + images.impressoes, alt: 'Arte R&N Gráfica com folhas, fotografia, adesivos e papéis coloridos.', description: 'Do documento do dia a dia à impressão que pede um toque especial.', icon: 'print' },
  { id: 'plastificacao', name: 'Plastificação', short: 'Plastificação', image: base + images.plastificacao, alt: 'Arte R&N Gráfica com plastificadora e amostras de documentos plastificados.', description: 'Proteção e acabamento para documentos e folhas inteiras.', icon: 'shield' },
  { id: 'documentos', name: 'Papelaria e documentos', short: 'Papelaria e documentos', image: base + images.documentos, alt: 'Arte R&N Gráfica com cartões de visita, talão de recibos e documentos.', description: 'Materiais para apresentar sua marca e organizar sua rotina.', icon: 'document' },
  { id: 'comunicacao', name: 'Comunicação visual', short: 'Comunicação visual', image: base + images.comunicacao, alt: 'Arte R&N Gráfica com banner e cartaz A4 personalizados.', description: 'Sua mensagem em destaque, na medida do seu projeto.', icon: 'banner' },
  { id: 'agendamentos', name: 'Agendamentos', short: 'Agendamentos', image: base + images.agendamentos, alt: 'Arte R&N Gráfica com agenda, pasta e cartão de agendamento.', description: 'Apoio para agendar os atendimentos de que você precisa.', icon: 'calendar', note: 'Agendamentos sujeitos à disponibilidade do órgão responsável.' },
  { id: 'personalizados', name: 'Personalizados e estampas', short: 'Personalizados e estampas', image: base + images.personalizados, alt: 'Arte R&N Gráfica com caneca, camisas estampadas e transferências DTF.', description: 'Sua identidade em peças para usar, presentear ou divulgar.', icon: 'shirt' },
];
export const services = [
  { id: 'oficio', category: 'impressoes', name: 'Impressões e xerox em papel ofício', description: 'Impressões e cópias para sua rotina. Informe o número de folhas.', unit: 'folhas' },
  { id: 'fotografico', category: 'impressoes', name: 'Impressões em papel fotográfico', description: 'Imprima fotos e imagens com o formato que seu projeto precisa.', unit: 'folhas' },
  { id: 'adesivo', category: 'impressoes', name: 'Impressões em papel adesivo', description: 'Para etiquetas, identificação e personalização. Consulte os formatos.', unit: 'folhas' },
  { id: 'cartao', category: 'impressoes', name: 'Impressões em papel-cartão', description: 'Uma opção de papel mais encorpado para seus impressos.', unit: 'folhas' },
  { id: 'plastificacao-documentos', category: 'plastificacao', name: 'Plastificação de documentos', description: 'Informe o tipo e a quantidade de documentos que deseja plastificar.', unit: 'documentos' },
  { id: 'plastificacao-a4', category: 'plastificacao', name: 'Plastificação de folhas A4 inteiras', description: 'Proteção para a folha inteira no formato A4.', unit: 'folhas' },
  { id: 'cartoes-visita', category: 'documentos', name: 'Cartões de visita', description: 'Apresente sua marca. Informe a quantidade e se já tem a arte.', unit: 'unidades' },
  { id: 'recibos', category: 'documentos', name: 'Talões de recibos de aluguel', description: 'Talões de 50 a 100 folhas. Escolha a quantidade de folhas por talão.', unit: 'talões', receipt: true },
  { id: 'contratos', category: 'documentos', name: 'Contratos de aluguel', description: 'Solicite seu contrato e consulte os detalhes necessários ao atendimento.', unit: 'documentos' },
  { id: 'residencia', category: 'documentos', name: 'Declarações de residência', description: 'Peça sua declaração e consulte os dados necessários para o serviço.', unit: 'documentos' },
  { id: 'cartazes', category: 'comunicacao', name: 'Cartazes A4', description: 'Divulgue avisos, promoções e informações no formato A4.', unit: 'unidades' },
  { id: 'banners', category: 'comunicacao', name: 'Banners', description: 'Destaque sua mensagem. Informe tamanho, quantidade e finalidade.', unit: 'unidades' },
  { id: 'cras', category: 'agendamentos', name: 'Agendamento no CRAS', description: 'Auxílio para agendar atendimento no CRAS.', unit: 'atendimentos' },
  { id: 'identidade', category: 'agendamentos', name: 'Agendamento para identidade', description: 'Apoio para agendar seu atendimento para a identidade.', unit: 'atendimentos' },
  { id: 'eleitor', category: 'agendamentos', name: 'Agendamento para título de eleitor', description: 'Auxílio para agendar atendimento relacionado ao título de eleitor.', unit: 'atendimentos' },
  { id: 'canecas', category: 'personalizados', name: 'Canecas personalizadas', description: 'Sua ideia em uma caneca. Informe a quantidade e o tema desejado.', unit: 'peças' },
  { id: 'camisas', category: 'personalizados', name: 'Camisas personalizadas', description: 'Peças para sua marca, equipe ou ocasião. Informe os tamanhos.', unit: 'peças' },
  { id: 'estampas', category: 'personalizados', name: 'Estampas personalizadas', description: 'Conte sua ideia e o tipo de peça que deseja personalizar.', unit: 'peças' },
  { id: 'sublimacao', category: 'personalizados', name: 'Sublimação total', description: 'Estampa por toda a peça. Informe modelo, tamanhos e quantidade.', unit: 'peças' },
  { id: 'dtf', category: 'personalizados', name: 'Estampas em DTF', description: 'Informe a arte, as medidas e a quantidade desejada.', unit: 'unidades' },
];
export const contactText = 'Peça um orçamento informando a quantidade de peças ou o serviço desejado. Tire suas dúvidas pelo nosso WhatsApp.';
