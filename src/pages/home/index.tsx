import { useEffect, useState, type FormEvent } from "react";
import { BsSearch } from "react-icons/bs";
import { Link, useNavigate } from "react-router";

export default function Home() {
  const [input, setInput] = useState("");
  const [coins, setCoins] = useState<CoinProps[]>([]);
  const [offSet, setOffSet] = useState(0);
  const navigate = useNavigate();

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

  interface DataProp {
    data: CoinProps[];
  }

  useEffect(() => {
    getData();
  }, [offSet]);

  async function getData() {
    fetch(
      `https://rest.coincap.io/v3/assets?limit=10&offset=${offSet}&apiKey=c68465153dcb68d084a2f6bd6dba51d4cce8abcd23d9587756279c87d320ab1d`
    )
      .then((response) => response.json())
      .then((data: DataProp) => {
        const coinsData = data.data;
        const price = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        });

        const priceCompact = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact",
        });

        const formatedResult = coinsData.map((item) => {
          const formated = {
            ...item,
            formatedPrice: price.format(Number(item.priceUsd)),
            formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
            formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr)),
          };
          return formated;
        });
        const ListCoins = [...coins, ...formatedResult];
        setCoins(ListCoins);
      });
  }

  function handleSumbmit(e: FormEvent) {
    e.preventDefault();
    console.log(input);

    if (input === "") return;

    navigate(`/detail/${input}`);
  }

  function handleOffSet() {
    setOffSet(offSet + 10);
  }

  return (
    <main className="flex flex-col items-center justify-center mx-4 py-10">
      <form
        onSubmit={handleSumbmit}
        className="flex items-center justify-center gap-4 w-full max-w-3xl mb-10"
      >
        <input
          className="px-4 py-2 bg-white outline-none rounded flex-grow text-black"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite o nome da moeda... Ex: bitcoin"
        />
        <button
          className="bg-blue-500 duration-250 cursor-pointer hover:bg-blue-600 p-2 rounded"
          type="submit"
        >
          <BsSearch size={24} color="#FFF" />
        </button>
      </form>

      <table className="w-full max-w-3xl text-center text-white border border-zinc-700">
        <thead>
          <tr className="bg-zinc-900">
            <th className="p-3 border border-zinc-700">Moeda</th>
            <th className="p-3 border border-zinc-700">Valor Mercado</th>
            <th className="p-3 border border-zinc-700">Preço</th>
            <th className="p-3 border border-zinc-700">Volume</th>
            <th className="p-3 border border-zinc-700">Mudança 24h</th>
          </tr>
        </thead>
        {coins.length > 0 &&
          coins.map((item) => (
            <tbody key={item.id}>
              <tr className="bg-zinc-800">
                <td className="p-3 border border-zinc-700 rounded-bl-lg flex items-center gap-2 flex-wrap">
                  <img
                    className="h-5"
                    src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`}
                    alt="Logo Cripto"
                  />
                  <Link
                    to={`/detail/${item.id}`}
                    className="text-blue-400 hover:underline"
                  >
                    {item.name} | {item.symbol}
                  </Link>
                </td>
                <td className="p-3 border border-zinc-700">
                  {item.formatedMarket}
                </td>
                <td className="p-3 border border-zinc-700">
                  {item.formatedPrice}
                </td>
                <td className="p-3 border border-zinc-700">
                  {item.formatedVolume}
                </td>
                <td
                  className={`
    p-3 border border-zinc-700 rounded-br-lg
    ${Number(item.changePercent24Hr) > 0 ? "text-green-500" : "text-red-500"}
  `}
                >
                  {Number(item.changePercent24Hr).toFixed(3)}
                </td>
              </tr>
            </tbody>
          ))}
      </table>
      <button
        onClick={handleOffSet}
        className="bg-blue-500 text-white mt-6 py-1.5 px-4 rounded cursor-pointer hover:opacity-80 duration-150"
      >
        Carregar Mais
      </button>
    </main>
  );
}
