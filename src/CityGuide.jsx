import { useState } from "react";
import { Search, MapPin, Calendar, Info, Sparkles, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import cityHeroImage from "@/assets/city-hero.jpg";

const CityGuideHero = () => {
  const [cityInput, setCityInput] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = () => {
    if (cityInput.trim()) {
      console.log("Searching for:", cityInput);
      // TODO: Implement search functionality
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] hover:scale-105"
        style={{ backgroundImage: `url(${cityHeroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background"></div>
        <div className="absolute inset-0 bg-gradient-mesh opacity-20"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 opacity-20">
        <Globe className="h-8 w-8 text-primary animate-float" />
      </div>
      <div className="absolute top-40 right-20 opacity-20">
        <Sparkles className="h-6 w-6 text-accent animate-bounce-gentle" />
      </div>
      <div className="absolute bottom-40 left-20 opacity-20">
        <Users className="h-10 w-10 text-primary animate-pulse-slow" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-24 pb-40">
        <div className="max-w-5xl mx-auto text-center">
          {/* Hero Text */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-gradient-card backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-border/50">
              <Sparkles className="h-4 w-4 text-primary animate-glow" />
              <span className="text-sm font-medium">Your Ultimate Travel Companion</span>
            </div>
            
            <h1 className="text-hero font-display font-bold mb-8 bg-gradient-hero bg-clip-text text-transparent leading-tight">
              Discover Cities Like Never Before
            </h1>
            
            <p className="text-xl text-muted-foreground mb-16 max-w-3xl mx-auto leading-relaxed font-light">
              Unlock the secrets of any city with personalized recommendations, live events, and insider tips 
              from locals who know best. Your adventure starts here.
            </p>
          </div>

          {/* Enhanced Search Section */}
          <div className="animate-slide-up">
            <Card className="bg-gradient-card backdrop-blur-lg border-border/50 shadow-elegant hover:shadow-glow transition-all duration-500 p-10 mb-20 relative overflow-hidden group">
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:animate-shimmer"></div>
              
              <div className="flex flex-col lg:flex-row gap-6 max-w-4xl mx-auto">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-6 w-6 transition-colors duration-300" />
                  <Input
                    type="text"
                    placeholder="Enter any city name..."
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className={`pl-12 h-16 text-lg bg-background/60 backdrop-blur-sm border-border/50 rounded-xl transition-all duration-300 ${
                      isSearchFocused ? 'border-primary/70 shadow-glow' : 'hover:border-primary/30'
                    }`}
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  size="lg"
                  className="h-16 px-10 bg-gradient-hero hover:shadow-glow transition-all duration-300 hover:scale-105 hover:-translate-y-1 text-lg font-semibold rounded-xl"
                >
                  <Search className="mr-3 h-6 w-6" />
                  Explore Now
                </Button>
              </div>
              
              <div className="flex justify-center gap-8 mt-8 text-sm text-muted-foreground">
                <span>🏙️ 1000+ Cities</span>
                <span>🎯 Personalized</span>
                <span>⚡ Real-time Data</span>
              </div>
            </Card>
          </div>

          {/* Enhanced Feature Cards */}
          <div className="grid lg:grid-cols-3 gap-8 animate-slide-up">
            <Card className="bg-gradient-card backdrop-blur-lg border-border/50 p-8 hover:shadow-card transition-all duration-500 hover:-translate-y-4 hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="mb-6 relative">
                  <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto group-hover:animate-glow">
                    <Calendar className="h-8 w-8 text-background group-hover:animate-bounce-gentle" />
                  </div>
                </div>
                <h3 className="text-title font-display font-semibold mb-4 group-hover:text-primary transition-colors duration-300">Local Events</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Discover concerts, festivals, exhibitions, and cultural events happening right now in your chosen destination.
                </p>
              </div>
            </Card>

            <Card className="bg-gradient-card backdrop-blur-lg border-border/50 p-8 hover:shadow-card transition-all duration-500 hover:-translate-y-4 hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="mb-6 relative">
                  <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto group-hover:animate-glow">
                    <MapPin className="h-8 w-8 text-background group-hover:animate-bounce-gentle" />
                  </div>
                </div>
                <h3 className="text-title font-display font-semibold mb-4 group-hover:text-accent transition-colors duration-300">Top Recommendations</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get curated lists of must-visit attractions, restaurants, and hidden gems recommended by locals and travelers.
                </p>
              </div>
            </Card>

            <Card className="bg-gradient-card backdrop-blur-lg border-border/50 p-8 hover:shadow-card transition-all duration-500 hover:-translate-y-4 hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="mb-6 relative">
                  <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto group-hover:animate-glow">
                    <Info className="h-8 w-8 text-background group-hover:animate-bounce-gentle" />
                  </div>
                </div>
                <h3 className="text-title font-display font-semibold mb-4 group-hover:text-primary transition-colors duration-300">Insider Tips</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Practical advice on transportation, local customs, best times to visit, and money-saving tips from experts.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityGuideHero;
