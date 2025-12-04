"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Send, Share2, MessageSquare, Image, Users, Facebook, Link, Linkedin, MessageCircle, Twitter } from "lucide-react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CommentSectionProps {
  postId: string;
}

const StaticComments = [
  {
    id: "c1",
    content: "I totally agree, this part of the game was insane!",
    created_at: "2 hours ago",
    profiles: { username: "Alex", avatar_url: null },
    likes: 5,
    isLiked: false,
  },
  {
    id: "c2",
    content: "One of my favorite quests ever!",
    created_at: "1 day ago",
    profiles: { username: "Riley", avatar_url: null },
    likes: 12,
    isLiked: true,
  },
];

export const CommentSection = ({ postId }: CommentSectionProps) => {
  return (
    <div className="mt-4 space-y-4">
      <div className="flex gap-3">
        <Textarea
          placeholder="Write a comment..."
          className="flex-1 bg-background/50 border-border"
          readOnly
        />
        <Button disabled className="self-end opacity-60 cursor-not-allowed">
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {StaticComments.map((comment) => (
          <div
            key={comment.id}
            className="flex gap-3 p-3 rounded-lg bg-background/30 border border-border/50"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.profiles.avatar_url || ""} />
              <AvatarFallback>
                {comment.profiles.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">
                  {comment.profiles.username}
                </span>
                <span className="text-xs text-muted-foreground">
                  {comment.created_at}
                </span>
              </div>
              <p className="text-sm text-foreground/90 mb-2">{comment.content}</p>

              <Button
                variant="ghost"
                size="sm"
                className={`gap-1 h-7 ${
                  comment.isLiked ? "text-primary" : ""
                } opacity-60 cursor-not-allowed`}
                disabled
              >
                <Heart
                  className={`h-3 w-3 ${
                    comment.isLiked ? "fill-current" : ""
                  }`}
                />
                {comment.likes}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



/* ===============================
   STATIC SHARE DIALOG
   =============================== */

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postContent: string;
}

export const ShareDialog = ({ open, onOpenChange }: ShareDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Post</DialogTitle>
          <DialogDescription>
            Share this post across your favorite platforms
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="gap-2 opacity-50 cursor-not-allowed"
            disabled
          >
            <Facebook className="h-4 w-4" />
            Facebook
          </Button>

          <Button
            variant="outline"
            className="gap-2 opacity-50 cursor-not-allowed"
            disabled
          >
            <Twitter className="h-4 w-4" />
            Twitter
          </Button>

          <Button
            variant="outline"
            className="gap-2 opacity-50 cursor-not-allowed"
            disabled
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </Button>

          <Button
            variant="outline"
            className="gap-2 opacity-50 cursor-not-allowed"
            disabled
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>

          <Button
            variant="outline"
            className="gap-2 col-span-2 opacity-50 cursor-not-allowed"
            disabled
          >
            <Link className="h-4 w-4" />
            Copy Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};



/* ===============================
   STATIC COMMUNITY PAGE
   =============================== */

const staticPosts = [
  {
    id: "1",
    content:
      "Just finished Witcher 3 again — that Bloody Baron quest STILL hits.",
    game: "The Witcher 3",
    created_at: "2 hours ago",
    profiles: { username: "AlexGaming", avatar_url: null },
    likes: 24,
    comments: 8,
    isLiked: true,
  },
  {
    id: "2",
    content:
      "Cyberpunk looks INSANE after the new patches. Night City at night 🔥🔥🔥",
    game: "Cyberpunk 2077",
    created_at: "1 day ago",
    profiles: { username: "NightWolf", avatar_url: null },
    likes: 15,
    comments: 5,
    isLiked: false,
  },
];

const topMembers = [
  { id: 1, name: "AlexGaming", level: 45 },
  { id: 2, name: "NightWolf", level: 38 },
  { id: 3, name: "PixelMaster", level: 42 },
];

export default function Community() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
              Community
            </h1>
            <p className="text-muted-foreground mb-8">
              Connect with gamers worldwide
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* LEFT SIDE */}
              <div className="lg:col-span-2 space-y-6">

                {/* New Post Static */}
                <Card className="p-6 bg-card/50 backdrop-blur border-border">
                  <h3 className="font-semibold mb-4">What's on your mind?</h3>
                  <Textarea
                    placeholder="Share your gaming moments..."
                    className="mb-4 bg-background/50 border-border"
                    readOnly
                  />
                  <div className="flex items-center justify-between">
                    <Button disabled variant="ghost" size="sm" className="gap-2 opacity-60">
                      <Image className="h-4 w-4" /> Add Image
                    </Button>
                    <Button
                      disabled
                      className="bg-gradient-to-r from-primary to-accent opacity-50 cursor-not-allowed"
                    >
                      Post
                    </Button>
                  </div>
                </Card>

                {/* Static posts */}
                {staticPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="p-6 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={post.profiles.avatar_url || ""} />
                        <AvatarFallback>
                          {post.profiles.username[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{post.profiles.username}</h4>
                            <p className="text-sm text-muted-foreground">
                              {post.created_at}
                            </p>
                          </div>

                          <Badge className="bg-primary/10 text-primary">
                            {post.game}
                          </Badge>
                        </div>

                        <p className="text-foreground/90 mb-4">{post.content}</p>

                        <div className="flex gap-6">
                          <Button
                            disabled
                            variant="ghost"
                            size="sm"
                            className={`gap-2 ${
                              post.isLiked ? "text-primary" : ""
                            } opacity-60 cursor-not-allowed`}
                          >
                            <Heart
                              className={`h-4 w-4 ${
                                post.isLiked ? "fill-current" : ""
                              }`}
                            />
                            {post.likes}
                          </Button>

                          <Button
                            disabled
                            variant="ghost"
                            size="sm"
                            className="gap-2 opacity-60 cursor-not-allowed"
                          >
                            <MessageSquare className="h-4 w-4" />
                            {post.comments}
                          </Button>

                          <Button
                            disabled
                            variant="ghost"
                            size="sm"
                            className="gap-2 opacity-60 cursor-not-allowed"
                          >
                            <Share2 className="h-4 w-4" />
                            Share
                          </Button>
                        </div>

                        {/* Static Comments */}
                        <CommentSection postId={post.id} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* RIGHT SIDE */}
              <div className="space-y-6">
                <Card className="p-6 bg-card/50 backdrop-blur border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Community Stats</h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-2xl font-bold">24,567</p>
                      <p className="text-sm text-muted-foreground">Active Members</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">1,234</p>
                      <p className="text-sm text-muted-foreground">Online Now</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-card/50 backdrop-blur border-border">
                  <h3 className="font-semibold mb-4">Top Members</h3>

                  <div className="space-y-4">
                    {topMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                            />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>

                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Level {member.level}
                            </p>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                          className="opacity-60 cursor-not-allowed"
                        >
                          Follow
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Static share dialog always closed */}
      <ShareDialog open={false} onOpenChange={() => {}} postContent="" />
    </div>
  );
}
