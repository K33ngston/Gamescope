"use client";
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { cn } from '@/lib/utils';
import { Trophy, Star, ThumbsUp, Flame, Gift, Award, Loader2 } from 'lucide-react';

// ============= Types & Constants =============

export type BadgeType = 
  | 'first_review'
  | 'five_star_fan'
  | 'review_machine'
  | 'community_king'
  | 'hot_streak'
  | 'critics_choice'
  | 'genre_master'
  | 'early_bird'
  | 'story_teller'
  | 'helpful_hand'
  | 'mvp'
  | 'legend';

export const BADGES: Record<BadgeType, { emoji: string; name: string; description: string }> = {
  first_review: { emoji: '🏆', name: 'First Review', description: 'Write your first review' },
  five_star_fan: { emoji: '⭐', name: 'Five Star Fan', description: 'Give five 5-star reviews' },
  review_machine: { emoji: '📝', name: 'Review Machine', description: 'Write 50 reviews' },
  community_king: { emoji: '👑', name: 'Community King', description: 'Get 100 upvotes on reviews' },
  hot_streak: { emoji: '🔥', name: 'Hot Streak', description: 'Review daily for 7 days' },
  critics_choice: { emoji: '💎', name: "Critic's Choice", description: 'Get 10 helpful votes' },
  genre_master: { emoji: '🎮', name: 'Genre Master', description: 'Review 5 games in same genre' },
  early_bird: { emoji: '🚀', name: 'Early Bird', description: 'Review new game within 1 week' },
  story_teller: { emoji: '💬', name: 'Story Teller', description: 'Write 5 reviews > 500 words' },
  helpful_hand: { emoji: '👍', name: 'Helpful Hand', description: 'Get 50 helpful votes' },
  mvp: { emoji: '🏅', name: 'MVP', description: 'Reach top 10 in leaderboard' },
  legend: { emoji: '👑', name: 'Legend', description: 'Earn all other badges' }
};

interface UserPoints {
  id: string;
  user_id: string;
  points: number;
  review_count: number;
  upvotes_received: number;
  weekly_points: number;
  monthly_points: number;
  last_daily_login: string | null;
  current_streak: number;
  longest_streak: number;
}

interface UserBadge {
  id: string;
  user_id: string;
  badge: BadgeType;
  earned_at: string;
}

interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url: string | null;
  points: number;
  review_count: number;
  upvotes_received: number;
  badges: BadgeType[];
}

// ============= Utility Functions =============

export const calculatePoints = (rating: number, reviewContent: string) => {
  let points = 10;
  points += rating * 2;
  const lengthBonus = Math.min(Math.floor(reviewContent.length / 10), 100);
  points += lengthBonus;
  const wordCount = reviewContent.trim().split(/\s+/).length;
  if (wordCount > 100) points += 20;
  if (rating === 5 || rating === 1) points += 5;
  return points;
};

export const getPointsBreakdown = (rating: number, reviewContent: string) => {
  const basePoints = 10;
  const ratingBonus = rating * 2;
  const lengthBonus = Math.min(Math.floor(reviewContent.length / 10), 100);
  const wordCount = reviewContent.trim().split(/\s+/).length;
  const qualityBonus = wordCount > 100 ? 20 : 0;
  const strongOpinionBonus = (rating === 5 || rating === 1) ? 5 : 0;
  return {
    basePoints,
    ratingBonus,
    lengthBonus,
    qualityBonus,
    strongOpinionBonus,
    total: basePoints + ratingBonus + lengthBonus + qualityBonus + strongOpinionBonus,
    wordCount
  };
};

export const getRankMedal = (rank: number) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
};

// ============= Hooks =============

export const useGamification = (userId: string | null) => {
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const { data: pointsData, error: pointsError } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (pointsError) throw pointsError;

      if (!pointsData) {
        const { data: newPoints, error: createError } = await supabase
          .from('user_points')
          .insert({ user_id: userId })
          .select()
          .single();

        if (createError) throw createError;
        setUserPoints(newPoints);
      } else {
        setUserPoints(pointsData);
      }

      const { data: badgesData, error: badgesError } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId);

      if (badgesError) throw badgesError;
      setUserBadges(badgesData || []);
    } catch (error) {
      console.error('Error fetching gamification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const claimDailyBonus = async () => {
    if (!userId || !userPoints) return false;

    const today = new Date().toISOString().split('T')[0];
    if (userPoints.last_daily_login === today) return false;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const newStreak = userPoints.last_daily_login === yesterdayStr ? userPoints.current_streak + 1 : 1;

    try {
      const { error } = await supabase
        .from('user_points')
        .update({
          points: userPoints.points + 10,
          weekly_points: userPoints.weekly_points + 10,
          monthly_points: userPoints.monthly_points + 10,
          last_daily_login: today,
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, userPoints.longest_streak)
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: '🎁 Daily Bonus!',
        description: `+10 points! Current streak: ${newStreak} days`,
      });

      if (newStreak >= 7) await awardBadge('hot_streak');
      await fetchUserData();
      return true;
    } catch (error) {
      console.error('Error claiming daily bonus:', error);
      return false;
    }
  };

  const awardBadge = async (badge: BadgeType) => {
    if (!userId) return;
    const alreadyHas = userBadges.some(b => b.badge === badge);
    if (alreadyHas) return;

    try {
      const { error } = await supabase
        .from('user_badges')
        .insert({ user_id: userId, badge });

      if (error) throw error;

      playNotificationSound();
      toast({
        title: `${BADGES[badge].emoji} New Badge Unlocked!`,
        description: `${BADGES[badge].name}: ${BADGES[badge].description}`,
      });

      await fetchUserData();
      const totalBadges = userBadges.length + 1;
      if (totalBadges === 11 && badge !== 'legend') await awardBadge('legend');
    } catch (error) {
      console.error('Error awarding badge:', error);
    }
  };

  const submitReview = async (gameName: string, rating: number, reviewContent: string) => {
    if (!userId || !userPoints) return null;

    const points = calculatePoints(rating, reviewContent);

    try {
      const { data: review, error: reviewError } = await supabase
        .from('reviews')
        .insert({
          user_id: userId,
          game_name: gameName,
          rating,
          review_content: reviewContent,
          points_earned: points
        })
        .select()
        .single();

      if (reviewError) throw reviewError;

      const newReviewCount = userPoints.review_count + 1;
      const { error: pointsError } = await supabase
        .from('user_points')
        .update({
          points: userPoints.points + points,
          weekly_points: userPoints.weekly_points + points,
          monthly_points: userPoints.monthly_points + points,
          review_count: newReviewCount
        })
        .eq('user_id', userId);

      if (pointsError) throw pointsError;

      toast({
        title: '🎉 Review Submitted!',
        description: `You earned ${points} points!`,
      });

      if (newReviewCount === 1) await awardBadge('first_review');
      if (newReviewCount >= 50) await awardBadge('review_machine');

      if (rating === 5) {
        const { count } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('rating', 5);

        if (count && count >= 5) await awardBadge('five_star_fan');
      }

      const wordCount = reviewContent.trim().split(/\s+/).length;
      if (wordCount > 500) {
        const { data: longReviews } = await supabase
          .from('reviews')
          .select('review_content')
          .eq('user_id', userId);

        const longReviewCount = longReviews?.filter(r => 
          r.review_content.trim().split(/\s+/).length > 500
        ).length || 0;

        if (longReviewCount >= 5) await awardBadge('story_teller');
      }

      await fetchUserData();
      return review;
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit review',
        variant: 'destructive',
      });
      return null;
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  return { userPoints, userBadges, loading, claimDailyBonus, submitReview, awardBadge, refetch: fetchUserData };
};

export const useLeaderboard = (timeframe: 'weekly' | 'monthly' | 'all-time') => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const pointsColumn = timeframe === 'weekly' ? 'weekly_points' : timeframe === 'monthly' ? 'monthly_points' : 'points';

        const { data: pointsData, error: pointsError } = await supabase
          .from('user_points')
          .select('user_id, points, weekly_points, monthly_points, review_count, upvotes_received')
          .order(pointsColumn, { ascending: false })
          .limit(50);

        if (pointsError) throw pointsError;
        if (!pointsData || pointsData.length === 0) {
          setLeaderboard([]);
          return;
        }

        const userIds = pointsData.map(p => p.user_id);
        const { data: profiles } = await supabase.from('profiles').select('id, username, avatar_url').in('id', userIds);
        const { data: allBadges } = await supabase.from('user_badges').select('user_id, badge').in('user_id', userIds);

        const entries: LeaderboardEntry[] = pointsData.map(p => {
          const profile = profiles?.find(pr => pr.id === p.user_id);
          const badges = allBadges?.filter(b => b.user_id === p.user_id).map(b => b.badge as BadgeType) || [];
          return {
            user_id: p.user_id,
            username: profile?.username || 'Unknown',
            avatar_url: profile?.avatar_url,
            points: timeframe === 'weekly' ? p.weekly_points : timeframe === 'monthly' ? p.monthly_points : p.points,
            review_count: p.review_count,
            upvotes_received: p.upvotes_received,
            badges
          };
        });

        setLeaderboard(entries.filter(e => e.points > 0));
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();

    const channel = supabase
      .channel('leaderboard-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_points' }, fetchLeaderboard)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [timeframe]);

  return { leaderboard, loading };
};

// ============= Components =============

const UserStats = ({ points, reviewCount, upvotesReceived, currentStreak }: { points: number; reviewCount: number; upvotesReceived: number; currentStreak: number }) => {
  const stats = [
    { icon: Trophy, label: 'Total Points', value: points.toLocaleString(), color: 'text-primary' },
    { icon: Star, label: 'Reviews', value: reviewCount, color: 'text-yellow-500' },
    { icon: ThumbsUp, label: 'Upvotes', value: upvotesReceived, color: 'text-green-500' },
    { icon: Flame, label: 'Streak', value: `${currentStreak} days`, color: 'text-orange-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-4 bg-card/50 backdrop-blur border-border">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-muted ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

const BadgeShowcase = ({ earnedBadges }: { earnedBadges: BadgeType[] }) => {
  const allBadges = Object.entries(BADGES) as [BadgeType, typeof BADGES[BadgeType]][];

  return (
    <Card className="p-6 bg-card/50 backdrop-blur border-border">
      <div className="flex items-center gap-2 mb-4">
        <Award className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold">Badges</h2>
        <span className="ml-auto text-sm text-muted-foreground">{earnedBadges.length}/{allBadges.length} earned</span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {allBadges.map(([key, badge]) => {
          const isEarned = earnedBadges.includes(key);
          return (
            <div
              key={key}
              className={cn(
                "flex flex-col items-center p-3 rounded-lg transition-all cursor-default",
                isEarned ? "bg-primary/20 border border-primary/30" : "bg-muted/30 opacity-50 grayscale"
              )}
              title={`${badge.name}: ${badge.description}`}
            >
              <span className="text-3xl mb-1">{badge.emoji}</span>
              <span className="text-xs text-center font-medium truncate w-full">{badge.name}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const DailyBonus = ({ lastDailyLogin, currentStreak, onClaim }: { lastDailyLogin: string | null; currentStreak: number; onClaim: () => Promise<boolean> }) => {
  const [canClaim, setCanClaim] = useState(false);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setCanClaim(lastDailyLogin !== today);
  }, [lastDailyLogin]);

  const handleClaim = async () => {
    setClaiming(true);
    const success = await onClaim();
    if (success) setCanClaim(false);
    setClaiming(false);
  };

  return (
    <Card className="p-4 bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/20">
            <Gift className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold">Daily Bonus</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Flame className="h-4 w-4 text-orange-500" />
              <span>{currentStreak} day streak</span>
            </div>
          </div>
        </div>
        <Button size="sm" onClick={handleClaim} disabled={!canClaim || claiming} className={canClaim ? 'animate-pulse' : ''}>
          {canClaim ? (claiming ? 'Claiming...' : 'Claim +10') : 'Claimed ✓'}
        </Button>
      </div>
    </Card>
  );
};

const PointsCalculator = ({ rating, reviewContent }: { rating: number; reviewContent: string }) => {
  const breakdown = getPointsBreakdown(rating, reviewContent);

  return (
    <div className="bg-muted/30 rounded-lg p-4 space-y-2">
      <h4 className="font-semibold text-sm mb-3">Points Preview</h4>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Base points</span>
          <span className="font-medium">+{breakdown.basePoints}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Rating bonus ({rating}★ × 2)</span>
          <span className={cn("font-medium", rating > 0 && "text-primary")}>+{breakdown.ratingBonus}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Length bonus ({reviewContent.length}/1000 chars)</span>
          <span className={cn("font-medium", breakdown.lengthBonus > 0 && "text-primary")}>+{breakdown.lengthBonus}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Quality bonus ({breakdown.wordCount} words)</span>
          <span className={cn("font-medium", breakdown.qualityBonus > 0 && "text-green-500")}>{breakdown.qualityBonus > 0 ? '+20' : '+0'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Strong opinion bonus</span>
          <span className={cn("font-medium", breakdown.strongOpinionBonus > 0 && "text-yellow-500")}>{breakdown.strongOpinionBonus > 0 ? '+5' : '+0'}</span>
        </div>
      </div>
      <div className="border-t border-border pt-2 mt-2">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total Points</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{breakdown.total}</span>
        </div>
      </div>
    </div>
  );
};

const ReviewForm = ({ userId, onSuccess }: { userId: string | null; onSuccess?: () => void }) => {
  const { toast } = useToast();
  const { submitReview } = useGamification(userId);
  const [gameName, setGameName] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [reviewContent, setReviewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const charCount = reviewContent.length;
  const isValidLength = charCount >= 50 && charCount <= 2000;

  const handleSubmit = async () => {
    if (!userId) {
      toast({ title: 'Please log in', description: 'You need to be logged in to submit a review', variant: 'destructive' });
      return;
    }
    if (!gameName.trim()) {
      toast({ title: 'Game name required', description: 'Please enter the name of the game', variant: 'destructive' });
      return;
    }
    if (rating === 0) {
      toast({ title: 'Rating required', description: 'Please select a star rating', variant: 'destructive' });
      return;
    }
    if (!isValidLength) {
      toast({ title: 'Invalid review length', description: 'Review must be between 50 and 2000 characters', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    const result = await submitReview(gameName, rating, reviewContent);
    setIsSubmitting(false);

    if (result) {
      setGameName('');
      setRating(0);
      setReviewContent('');
      onSuccess?.();
    }
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur border-border">
      <h2 className="text-xl font-bold mb-4">Write a Review</h2>
      <div className="space-y-4">
        <Input placeholder="Game name..." value={gameName} onChange={(e) => setGameName(e.target.value)} className="bg-background/50 border-border" />
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-muted-foreground">Rating:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 transition-transform hover:scale-110"
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setRating(star)}
                >
                  <Star className={`h-6 w-6 transition-colors ${star <= (hoveredStar || rating) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <Textarea placeholder="Share your thoughts about the game (50-2000 characters)..." value={reviewContent} onChange={(e) => setReviewContent(e.target.value)} className="bg-background/50 border-border min-h-32" />
          <div className="flex justify-between mt-1 text-xs">
            <span className={charCount < 50 ? 'text-destructive' : 'text-muted-foreground'}>{charCount < 50 ? `${50 - charCount} more characters needed` : 'Min: 50 characters'}</span>
            <span className={charCount > 2000 ? 'text-destructive' : 'text-muted-foreground'}>{charCount}/2000</span>
          </div>
        </div>
        <PointsCalculator rating={rating} reviewContent={reviewContent} />
        <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90" onClick={handleSubmit} disabled={isSubmitting || !isValidLength || rating === 0 || !gameName.trim()}>
          {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>) : 'Submit Review'}
        </Button>
      </div>
    </Card>
  );
};

const Leaderboard = () => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'all-time'>('weekly');
  const { leaderboard, loading } = useLeaderboard(timeframe);

  return (
    <Card className="p-6 bg-card/50 backdrop-blur border-border">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold">Leaderboard</h2>
      </div>
      <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as typeof timeframe)}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="all-time">All-Time</TabsTrigger>
        </TabsList>
        <TabsContent value={timeframe} className="space-y-3">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
          ) : leaderboard.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No entries yet. Be the first to submit a review!</p>
          ) : (
            leaderboard.map((entry, index) => (
              <div key={entry.user_id} className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${index < 3 ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'}`}>
                <div className="text-2xl font-bold w-10 text-center">{getRankMedal(index + 1)}</div>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={entry.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.username}`} />
                  <AvatarFallback>{entry.username[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{entry.username}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Star className="h-3 w-3" />{entry.review_count} reviews</span>
                    <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" />{entry.upvotes_received}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {entry.badges.slice(0, 3).map((badge) => (
                      <span key={badge} className="text-lg" title={BADGES[badge].name}>{BADGES[badge].emoji}</span>
                    ))}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{entry.points.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

// ============= Main Page Component =============

const Gamification = () => {
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { userPoints, userBadges, loading, claimDailyBonus, refetch } = useGamification(userId);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
              Gamification
            </h1>
            <p className="text-muted-foreground mb-8">Earn points, unlock badges, and climb the leaderboard!</p>

            {!userId ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">Please log in to access gamification features</p>
              </div>
            ) : loading ? (
              <div className="space-y-6">
                <Skeleton className="h-20 w-full" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {userPoints && <DailyBonus lastDailyLogin={userPoints.last_daily_login} currentStreak={userPoints.current_streak} onClaim={claimDailyBonus} />}
                {userPoints && <UserStats points={userPoints.points} reviewCount={userPoints.review_count} upvotesReceived={userPoints.upvotes_received} currentStreak={userPoints.current_streak} />}
                <BadgeShowcase earnedBadges={userBadges.map(b => b.badge as BadgeType)} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ReviewForm userId={userId} onSuccess={refetch} />
                  <Leaderboard />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Gamification;
