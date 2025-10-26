"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AccountFiltersProps {
  priceRange: string;
  gameId: string;
  accountType: string;
  uniqueGames: number[];
  games?: Array<{ gameCategoryId: number; gameCategoryName: string }>;
  accountTypes?: Array<{ id: string; name: string }>;
  onPriceRangeChange: (range: string) => void;
  onGameChange: (game: string) => void;
  onAccountTypeChange: (type: string) => void;
  onReset: () => void;
}

export function AccountFilters({
  priceRange,
  gameId,
  accountType,
  uniqueGames,
  games = [],
  accountTypes = [],
  onPriceRangeChange,
  onGameChange,
  onAccountTypeChange,
  onReset,
}: AccountFiltersProps) {
  const isFiltering =
    priceRange !== "all" || gameId !== "all" || accountType !== "all";

  // Get game name for display
  const getGameDisplayName = (id: string) => {
    if (games && games.length > 0) {
      const game = games.find((g) => g.gameCategoryId.toString() === id);
      return game?.gameCategoryName || id;
    }
    return id;
  };

  // Get account type name for display
  const getTypeDisplayName = (id: string) => {
    if (accountTypes && accountTypes.length > 0) {
      const type = accountTypes.find((t) => t.name === id);
      return type?.name || id;
    }
    return id;
  };

  return (
    <div className="bg-black border border-[#3f9ced]/20 rounded p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Bộ lọc</h3>
        {isFiltering && (
          <button
            onClick={onReset}
            className="text-xs px-3 py-1 bg-[#3f9ced]/20 text-[#3f9ced] rounded hover:bg-[#3f9ced]/30 transition-colors"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Price Filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-400">Giá</label>
          <Select value={priceRange} onValueChange={onPriceRangeChange}>
            <SelectTrigger className="bg-[#1a1a1a] border border-[#3f9ced]/20 text-white h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border border-[#3f9ced]/20 text-white">
              <SelectItem value="all">Tất cả giá</SelectItem>
              <SelectItem value="under100">Dưới $100</SelectItem>
              <SelectItem value="100to200">$100 - $200</SelectItem>
              <SelectItem value="200to500">$200 - $500</SelectItem>
              <SelectItem value="over500">Trên $500</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Game Filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-400">Game</label>
          <Select value={gameId} onValueChange={onGameChange}>
            <SelectTrigger className="bg-[#1a1a1a] border border-[#3f9ced]/20 text-white h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border border-[#3f9ced]/20 text-white">
              <SelectItem value="all">Tất cả game</SelectItem>
              {games && games.length > 0
                ? games.map((game, index) => (
                    <SelectItem
                      key={`game-${game.gameCategoryId}-${index}`}
                      value={game.gameCategoryId.toString()}
                    >
                      {game.gameCategoryName}
                    </SelectItem>
                  ))
                : uniqueGames.map((gameCategoryId, index) => (
                    <SelectItem
                      key={`unique-${gameCategoryId}-${index}`}
                      value={gameCategoryId.toString()}
                    >
                      Game ID: {gameCategoryId}
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>
        </div>

        {/* Account Type Filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-400">
            Loại tài khoản
          </label>
          <Select value={accountType} onValueChange={onAccountTypeChange}>
            <SelectTrigger className="bg-[#1a1a1a] border border-[#3f9ced]/20 text-white h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border border-[#3f9ced]/20 text-white">
              <SelectItem value="all">Tất cả loại</SelectItem>
              {accountTypes && accountTypes.length > 0 ? (
                accountTypes.map((type) => (
                  <SelectItem key={type.id} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))
              ) : (
                <>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Reroll">Reroll</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isFiltering && (
        <div className="mt-3 text-xs text-gray-400">
          Đang lọc theo:{" "}
          {[
            priceRange !== "all" && `Giá (${priceRange})`,
            gameId !== "all" && `Game (${getGameDisplayName(gameId)})`,
            accountType !== "all" &&
              `Loại (${getTypeDisplayName(accountType)})`,
          ]
            .filter(Boolean)
            .join(", ")}
        </div>
      )}
    </div>
  );
}
