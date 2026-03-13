"use client";

import { ItemList } from "@/src/components/itemList";
import { useCart } from "@/src/hooks/useCart";
import { createOrder } from "@/src/lib/ordersRepo";
import {
  decrementInventory,
  ensureSeededProducts,
} from "@/src/lib/productsRepo";
import {
  PaymentMethod,
  ShipmentType,
  ShippingStatus,
} from "@/src/types/types";
import { formatCurrency } from "@/src/utils/utils";
import {
  Button,
  Divider,
  Input,
  Radio,
  Select,
  Spin,
  notification,
} from "antd";
import {
  CreditCardOutlined,
  DollarOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import { Search, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/src/app/auth/AuthContext";

const ORIGEM = { lat: -7.2306, lng: -35.8811 };
const PRECO_POR_KM = 0.1;
const VELOCIDADE_KMH = 60;

function calcularDistanciaKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calcularPrazoUtil(distanciaKm: number): string {
  const horas = distanciaKm / VELOCIDADE_KMH;
  const dias = Math.ceil(horas / 8);
  if (dias <= 1) return "1 dia útil";
  return `${dias} dias úteis`;
}

type FreteOption = {
  servico: string;
  prazo: string;
  preco: number;
};

type EnderecoViaCep = {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
};

const RETIRADA_NO_ESTABELECIMENTO: FreteOption = {
  servico: "Retirar no estabelecimento",
  prazo: "",
  preco: 0,
};

async function buscarCoordenadasPorCidade(
  cidade: string,
  uf: string,
): Promise<{ lat: number; lng: number } | null> {
  try {
    const query = encodeURIComponent(`${cidade}, ${uf}, Brasil`);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
      { headers: { "Accept-Language": "pt-BR" } },
    );
    const data = await res.json();
    if (data.length === 0) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

const PaymentMethodFormatter = {
  [PaymentMethod.CARD]: {
    title: "Cartão",
    icon: <CreditCardOutlined />,
  },
  [PaymentMethod.PIX]: {
    title: "Pix",
    icon: <DollarOutlined />,
  },
  [PaymentMethod.BOLETO]: {
    title: "Boleto",
    icon: <FileDoneOutlined />,
  },
};

export default function CartPage() {
  const { cartItems, setItemQuantity, removeCartItem, clearCart } = useCart();
  const [total, setTotal] = useState<number>(0);
  const [isPlacing, setIsPlacing] = useState(false);
  const [opcaoEntrega, setOpcaoEntrega] = useState<ShipmentType>(
    ShipmentType.PICKUP,
  );
  const [metodoPagamento, setMetodoPagamento] = useState<PaymentMethod>(
    PaymentMethod.CARD,
  );

  const router = useRouter();
  const { role } = useAuth();

  const [cep, setCep] = useState("");
  const [loadingFrete, setLoadingFrete] = useState(false);
  const [endereco, setEndereco] = useState<EnderecoViaCep | null>(null);
  const [distanciaKm, setDistanciaKm] = useState<number | null>(null);
  const [freteOpcoes, setFreteOpcoes] = useState<FreteOption[]>([]);
  const [freteSelecionado, setFreteSelecionado] = useState<FreteOption | null>(
    RETIRADA_NO_ESTABELECIMENTO,
  );
  const [freteErro, setFreteErro] = useState("");
  const [customerName, setCustomerName] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem("currentCustomerName") ?? "";
  });

  useEffect(() => {
    if (role === "admin") {
      router.replace("/products");
    }
  }, [role, router]);

  useEffect(() => {
    setTotal(
      cartItems.reduce(
        (acc, current) => acc + current.preco * current.quantity,
        0,
      ),
    );
  }, [cartItems]);

  const totalComFrete = total + (freteSelecionado?.preco ?? 0);

  const handleCheckout = async () => {
    if (!cartItems.length) return;
    setIsPlacing(true);

    try {
      const items = cartItems.map((i) => ({
        nome: i.nome,
        preco: i.preco,
        quantity: i.quantity,
        isEbook: i.isEbook,
      }));

      if (freteSelecionado && freteSelecionado.preco > 0) {
        items.push({
          nome: `Frete - ${freteSelecionado.servico} (${freteSelecionado.prazo})`,
          preco: freteSelecionado.preco,
          quantity: 1,
          isEbook: false,
        });
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Erro ao iniciar checkout");
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (e) {
      notification.error({
        title: "Não foi possível finalizar",
        description:
          e instanceof Error ? e.message : "Erro ao processar o pedido.",
        placement: "bottomRight",
      });
      setIsPlacing(false);
    }
  };

  const handleCalcularFrete = async () => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      setFreteErro("Digite um CEP válido com 8 dígitos.");
      return;
    }

    setLoadingFrete(true);
    setFreteErro("");
    setEndereco(null);
    setDistanciaKm(null);
    setFreteOpcoes([]);
    setFreteSelecionado(null);

    try {
      const resCep = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const dadosCep = await resCep.json();

      if (dadosCep.erro) {
        setFreteErro("CEP não encontrado.");
        return;
      }

      setEndereco(dadosCep);

      const coords = await buscarCoordenadasPorCidade(
        dadosCep.localidade,
        dadosCep.uf,
      );

      if (!coords) {
        setFreteErro("Não foi possível calcular a distância.");
        return;
      }

      const distancia = calcularDistanciaKm(
        ORIGEM.lat,
        ORIGEM.lng,
        coords.lat,
        coords.lng,
      );

      const distanciaArredondada = Math.round(distancia);
      setDistanciaKm(distanciaArredondada);

      const precoPAC = parseFloat(
        ((distanciaArredondada / 10) * PRECO_POR_KM + 15).toFixed(2),
      );
      const precoSEDEX = parseFloat((precoPAC * 1.6).toFixed(2));

      const prazoNormal = calcularPrazoUtil(distanciaArredondada);
      const prazoExpresso = calcularPrazoUtil(distanciaArredondada / 2);

      const opcoes: FreteOption[] = [
        { servico: "PAC", prazo: prazoNormal, preco: precoPAC },
        { servico: "SEDEX", prazo: prazoExpresso, preco: precoSEDEX },
      ];

      setFreteOpcoes(opcoes);
      setFreteSelecionado(opcoes[0]);
    } catch {
      setFreteErro("Erro ao calcular o frete.");
    } finally {
      setLoadingFrete(false);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 8);
    if (v.length > 5) v = v.slice(0, 5) + "-" + v.slice(5);
    setCep(v);
    setFreteErro("");
  };

  return (
    <main className="max-w-5xl mx-auto">
      <section className="flex mt-2 items-center gap-4 px-4 py-4 m-1 bg-white shadow-md rounded">
        <h1>Carrinho</h1>

        <span>Total de items: {cartItems.length}</span>

        <Divider orientation="vertical" />

        <span>
          Total: {formatCurrency(totalComFrete)}
          {freteSelecionado && freteSelecionado.preco > 0 && (
            <span className="text-xs text-gray-400 ml-1">
              (incl. frete {freteSelecionado.servico})
            </span>
          )}
        </span>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Pagamento:</span>

          <Select
            value={metodoPagamento}
            style={{ width: 160 }}
            disabled={cartItems.length == 0}
            onChange={(v: PaymentMethod) => setMetodoPagamento(v)}
            options={Object.entries(PaymentMethodFormatter).map(
              ([key, info]) => ({
                value: key,
                label: (
                  <div className="flex items-center gap-2">
                    {info.icon}
                    {info.title}
                  </div>
                ),
              }),
            )}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Entrega:</span>
          <Select
            value={opcaoEntrega}
            style={{ width: 220 }}
            disabled={cartItems.length == 0}
            onChange={(value: ShipmentType) => {
              setOpcaoEntrega(value);

              if (value === ShipmentType.PICKUP) {
                setFreteSelecionado(RETIRADA_NO_ESTABELECIMENTO);
                setFreteOpcoes([]);
                setEndereco(null);
                setDistanciaKm(null);
                setFreteErro("");
                setCep("");
              } else {
                setFreteSelecionado(null);
              }
            }}
            options={[
              {
                value: ShipmentType.PICKUP,
                label: "Retirar no estabelecimento",
              },
              {
                value: ShipmentType.HOME_DELIVERY,
                label: "Entregar na minha casa",
              },
            ]}
          />
        </div>

        <Button
          type="primary"
          disabled={!cartItems.length || !freteSelecionado || !customerName.trim()}
          loading={isPlacing}
          onClick={async () => {
            try {
              if (!customerName.trim()) {
                notification.error({
                  title: "Informe seu nome",
                  description:
                    "Digite seu nome para conseguirmos identificar seus pedidos depois.",
                  placement: "bottomRight",
                });
                return;
              }

              setIsPlacing(true);

              await ensureSeededProducts();

              await decrementInventory(
                cartItems.map((i) => ({
                  productId: i.id,
                  quantity: i.quantity,
                })),
              );

              if (typeof window !== "undefined") {
                window.localStorage.setItem(
                  "currentCustomerName",
                  customerName.trim(),
                );
              }

              await createOrder({
                createdAt: new Date().toISOString(),
                total: totalComFrete,
                items: cartItems.map((i) => ({
                  productId: i.id,
                  nome: i.nome,
                  preco: i.preco,
                  quantity: i.quantity,
                  isEbook: i.isEbook,
                })),
                shippingStatus: ShippingStatus.SENT,
                paymentMethod: metodoPagamento,
                customerName: customerName.trim(),
                shipmentType: opcaoEntrega,
              });

              notification.success({
                title: "Pedido realizado",
                description: "Seu pedido foi registrado com sucesso.",
                placement: "bottomRight",
              });

              await handleCheckout();
              clearCart();
            } catch (e) {
              notification.error({
                title: "Não foi possível finalizar",
                description:
                  e instanceof Error
                    ? e.message
                    : "Erro ao processar o pedido.",
                placement: "bottomRight",
              });
            } finally {
              setIsPlacing(false);
            }
          }}
        >
          Finalizar compra
        </Button>
      </section>

      <Divider className="p-4" />

      <div className="flex flex-row gap-4">
        <section className="flex-1">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <ItemList
                key={item.id}
                {...item}
                setItemQuantity={setItemQuantity}
                removeCartItem={removeCartItem}
              />
            ))
          ) : (
            <span>Carrinho vazio</span>
          )}
        </section>

        {/* Cliente + Frete */}
        <section className="w-72 shrink-0">
          <div className="flex flex-col gap-3 px-4 py-4 m-1 bg-white shadow-md rounded">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-800">
                Seu nome (para identificar pedidos)
              </span>
              <Input
                placeholder="Digite seu nome"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            {opcaoEntrega === ShipmentType.PICKUP && (
              <p className="text-sm text-gray-600">
                Retirar no estabelecimento selecionado. Nenhum frete será cobrado.
              </p>
            )}

            {opcaoEntrega === ShipmentType.HOME_DELIVERY && (
              <>
                <Divider className="my-2" />

                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-gray-600" />
                  <span className="font-semibold text-gray-800">
                    Simule seu frete
                  </span>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="00000-000"
                    value={cep}
                    onChange={handleCepChange}
                    onPressEnter={handleCalcularFrete}
                    className="flex-1"
                    maxLength={9}
                    status={freteErro ? "error" : ""}
                  />
                </div>

                <Button
                  type="primary"
                  icon={<Search size={14} />}
                  onClick={handleCalcularFrete}
                  loading={loadingFrete}
                  disabled={cep.replace(/\D/g, "").length !== 8}
                >
                  Atualizar
                </Button>

                {freteErro && (
                  <p className="text-xs text-red-500">{freteErro}</p>
                )}

                {loadingFrete && (
                  <div className="flex justify-center py-2">
                    <Spin size="small" />
                  </div>
                )}

                {endereco && !loadingFrete && (
                  <div className="bg-gray-50 rounded p-2 text-xs text-gray-600">
                    <p className="font-medium text-gray-700">
                      {endereco.localidade} - {endereco.uf}
                    </p>
                  </div>
                )}

                {freteOpcoes.length > 0 && !loadingFrete && (
                  <>
                    <Divider className="my-1" />

                    <Radio.Group
                      value={freteSelecionado?.servico}
                      onChange={(e) =>
                        setFreteSelecionado(
                          freteOpcoes.find(
                            (o) => o.servico === e.target.value,
                          ) ?? null,
                        )
                      }
                      className="flex flex-col gap-2"
                    >
                      {freteOpcoes.map((opcao) => (
                        <Radio key={opcao.servico} value={opcao.servico}>
                          <div className="flex justify-between items-center w-48">
                            <div>
                              <p className="text-sm font-medium">
                                {opcao.servico}
                              </p>
                              <p className="text-xs text-gray-400">
                                {opcao.prazo}
                              </p>
                            </div>

                            <span className="text-sm font-semibold text-gray-700">
                              {formatCurrency(opcao.preco)}
                            </span>
                          </div>
                        </Radio>
                      ))}
                    </Radio.Group>
                  </>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}