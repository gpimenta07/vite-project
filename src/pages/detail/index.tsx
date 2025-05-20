import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

function Detail() {
  const { crypto } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState<CoinProps>();
  const [loading, setLoading] = useState(true);

  interface CoinProps {
    changePercent24Hr: string;
    explorer: string;
    id: string;
    marketCapUsd: string;
    maxSupply: string;
    name: string;
    priceUsd: string;
    rank: string;
    supply: string;
    symbol: string;
    volumeUsd24Hr: string;
    vwap24Hr: string;
    formatedPrice?: string;
    formatedMarket?: string;
    formatedVolume?: string;
  }

  interface ResponseData {
    data: CoinProps;
  }

  interface ErrorData {
    error: string;
  }

  type DataProps = ResponseData | ErrorData;

  useEffect(() => {
    async function getCoin() {
      try {
        fetch(
          `https://rest.coincap.io/v3/assets/${crypto}?apiKey=298b6b1b37c54cb480a79420ac5add1d3a2af29462669df7214196f1cb9f3cc9`
        )
          .then((response) => response.json())
          .then((data: DataProps) => {
            if ("error" in data) {
              navigate("/");
              return;
            }

            const price = Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            });

            const priceCompact = Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "compact",
            });

            const resultData = {
              ...data.data,
              formatedPrice: price.format(Number(data.data.priceUsd)),
              formatedMarket: priceCompact.format(
                Number(data.data.marketCapUsd)
              ),
              formatedVolume: priceCompact.format(
                Number(data.data.volumeUsd24Hr)
              ),
            };
            setCoin(resultData);
            setLoading(false);
          });
      } catch (error) {
        console.log(error);
        navigate("/");
      }
    }
    getCoin();
  }, [crypto]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-900">
        <h2 className="text-3xl text-white font-bold animate-pulse">
          Carregando...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-6">
      <div className="max-w-2xl mx-auto bg-zinc-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <img
            className="w-12 h-12"
            src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`}
            alt={`Logo da ${coin?.name}`}
          />
          <h1 className="text-3xl font-bold text-white font-mono">
            {coin?.name} <span className="text-zinc-400">| {coin?.symbol}</span>
          </h1>
        </div>

        <div className="space-y-3 text-white text-base">
          <p>
            <span className="font-semibold">Preço:</span>{" "}
            {coin?.formatedPrice}
          </p>
          <p>
            <span className="font-semibold">Valor de mercado:</span>{" "}
            {coin?.formatedMarket}
          </p>
          <p>
            <span className="font-semibold">Volume 24h:</span>{" "}
            {coin?.formatedVolume}
          </p>
          <div className="flex gap-2">
            <p className="font-semibold">Mudança em 24h:</p>
            <p
              className={`font-bold ${
                Number(coin?.changePercent24Hr) > 0
                  ? "text-green-400"
                  : "text-red-500"
              }`}
            >
              {Number(coin?.changePercent24Hr).toFixed(2)}%
            </p>
          </div>
          <a
            href={coin?.explorer}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-4 text-blue-400 hover:text-blue-500 underline"
          >
            Ver no Explorer ↗
          </a>
        </div>
      </div>
    </div>
  );
}

export default Detail;
