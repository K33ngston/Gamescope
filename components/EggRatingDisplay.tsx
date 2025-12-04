interface EggRatingDisplayProps {
  rottenPercentage: number;
  freshCount: number;
  rottenCount: number;
}

export const EggRatingDisplay = ({ rottenPercentage, freshCount, rottenCount }: EggRatingDisplayProps) => {
  return (
    <div className="bg-card/50 backdrop-blur border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-3xl mb-1">🥚</div>
            <div className="text-2xl font-bold text-green-400">{freshCount}</div>
            <div className="text-xs text-muted-foreground">Fresh</div>
          </div>

          <div className="h-12 w-px bg-border" />

          <div className="text-center">
            <div className="text-3xl mb-1">🤢</div>
            <div className="text-2xl font-bold text-red-400">{rottenCount}</div>
            <div className="text-xs text-muted-foreground">Rotten</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-muted-foreground mb-1">Rotten Egg Rate</div>
          <div className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            {rottenPercentage}%
          </div>
        </div>
      </div>

      <div className="mt-4 h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
          style={{ width: `${rottenPercentage}%` }}
        />
      </div>
    </div>
  );
};
