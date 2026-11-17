<?php

namespace Database\Seeders;

use App\Models\Game;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    public function run(): void
    {
        $games = [
            ['slug' => 'elden-ring', 'title' => 'Elden Ring', 'release_year' => 2022, 'developer' => 'FromSoftware', 'genres' => ['Action RPG', 'Open World'], 'cover_url' => '/covers/elden-ring.jpg', 'rating' => 4.8],
            ['slug' => 'red-dead-redemption-2', 'title' => 'Red Dead Redemption 2', 'release_year' => 2018, 'developer' => 'Rockstar Games', 'genres' => ['Action', 'Adventure'], 'cover_url' => '/covers/red-dead-redemption-2.jpg', 'rating' => 4.7],
            ['slug' => 'cyberpunk-2077', 'title' => 'Cyberpunk 2077', 'release_year' => 2020, 'developer' => 'CD Projekt Red', 'genres' => ['Action RPG', 'Open World'], 'cover_url' => '/covers/cyberpunk-2077.jpg', 'rating' => 4.1],
            ['slug' => 'the-witcher-3', 'title' => 'The Witcher 3: Wild Hunt', 'release_year' => 2015, 'developer' => 'CD Projekt Red', 'genres' => ['Action RPG', 'Fantasy'], 'cover_url' => '/covers/the-witcher-3.jpg', 'rating' => 4.8],
            ['slug' => 'hollow-knight', 'title' => 'Hollow Knight', 'release_year' => 2017, 'developer' => 'Team Cherry', 'genres' => ['Metroidvania', 'Platformer'], 'cover_url' => '/covers/hollow-knight.jpg', 'rating' => 4.7],
            ['slug' => 'god-of-war', 'title' => 'God of War', 'release_year' => 2018, 'developer' => 'Santa Monica Studio', 'genres' => ['Action', 'Adventure'], 'cover_url' => '/covers/god-of-war.jpg', 'rating' => 4.6],
            ['slug' => 'persona-5-royal', 'title' => 'Persona 5 Royal', 'release_year' => 2019, 'developer' => 'Atlus', 'genres' => ['JRPG', 'Social Sim'], 'cover_url' => '/covers/persona-5-royal.jpg', 'rating' => 4.7],
            ['slug' => 'hades', 'title' => 'Hades', 'release_year' => 2020, 'developer' => 'Supergiant Games', 'genres' => ['Roguelike', 'Action'], 'cover_url' => '/covers/hades.jpg', 'rating' => 4.6],
            ['slug' => 'baldurs-gate-3', 'title' => "Baldur's Gate 3", 'release_year' => 2023, 'developer' => 'Larian Studios', 'genres' => ['CRPG', 'Turn-based'], 'cover_url' => '/covers/baldurs-gate-3.jpg', 'rating' => 4.8],
            ['slug' => 'sekiro', 'title' => 'Sekiro: Shadows Die Twice', 'release_year' => 2019, 'developer' => 'FromSoftware', 'genres' => ['Action', 'Adventure'], 'cover_url' => '/covers/sekiro.jpg', 'rating' => 4.5],
            ['slug' => 'disco-elysium', 'title' => 'Disco Elysium', 'release_year' => 2019, 'developer' => 'ZA/UM', 'genres' => ['RPG', 'Detective'], 'cover_url' => '/covers/disco-elysium.jpg', 'rating' => 4.6],
            ['slug' => 'celeste', 'title' => 'Celeste', 'release_year' => 2018, 'developer' => 'Maddy Makes Games', 'genres' => ['Platformer', 'Indie'], 'cover_url' => '/covers/celeste.jpg', 'rating' => 4.5],
            ['slug' => 'resident-evil-4', 'title' => 'Resident Evil 4', 'release_year' => 2023, 'developer' => 'Capcom', 'genres' => ['Survival Horror', 'Action'], 'cover_url' => '/covers/resident-evil-4.jpg', 'rating' => 4.6],
            ['slug' => 'spider-man-remastered', 'title' => "Marvel's Spider-Man Remastered", 'release_year' => 2018, 'developer' => 'Insomniac Games', 'genres' => ['Action', 'Open World'], 'cover_url' => '/covers/spider-man-remastered.jpg', 'rating' => 4.4],
            ['slug' => 'death-stranding', 'title' => 'Death Stranding', 'release_year' => 2019, 'developer' => 'Kojima Productions', 'genres' => ['Adventure', 'Simulation'], 'cover_url' => '/covers/death-stranding.jpg'],
            ['slug' => 'monster-hunter-world', 'title' => 'Monster Hunter: World', 'release_year' => 2018, 'developer' => 'Capcom', 'genres' => ['Action RPG', 'Co-op'], 'cover_url' => '/covers/monster-hunter-world.jpg', 'rating' => 4.3],
            ['slug' => 'portal-2', 'title' => 'Portal 2', 'release_year' => 2011, 'developer' => 'Valve', 'genres' => ['Puzzle', 'Comedy'], 'cover_url' => '/covers/portal-2.jpg', 'rating' => 4.8],
            ['slug' => 'dark-souls-3', 'title' => 'Dark Souls III', 'release_year' => 2016, 'developer' => 'FromSoftware', 'genres' => ['Action RPG', 'Dark Fantasy'], 'cover_url' => '/covers/dark-souls-3.jpg', 'rating' => 4.6],
            ['slug' => 'nier-automata', 'title' => 'NieR: Automata', 'release_year' => 2017, 'developer' => 'PlatinumGames', 'genres' => ['Action RPG', 'Sci-Fi'], 'cover_url' => '/covers/nier-automata.jpg', 'rating' => 4.6],
            ['slug' => 'outer-wilds', 'title' => 'Outer Wilds', 'release_year' => 2019, 'developer' => 'Mobius Digital', 'genres' => ['Exploration', 'Mystery'], 'cover_url' => '/covers/outer-wilds.jpg', 'rating' => 4.7],
            ['slug' => 'stardew-valley', 'title' => 'Stardew Valley', 'release_year' => 2016, 'developer' => 'ConcernedApe', 'genres' => ['Farming Sim', 'Cozy'], 'cover_url' => '/covers/stardew-valley.jpg', 'rating' => 4.8],
            ['slug' => 'it-takes-two', 'title' => 'It Takes Two', 'release_year' => 2021, 'developer' => 'Hazelight Studios', 'genres' => ['Co-op', 'Platformer'], 'cover_url' => '/covers/it-takes-two.jpg', 'rating' => 4.5],
            ['slug' => 'subnautica', 'title' => 'Subnautica', 'release_year' => 2018, 'developer' => 'Unknown Worlds', 'genres' => ['Survival', 'Exploration'], 'cover_url' => '/covers/subnautica.jpg', 'rating' => 4.6],
            ['slug' => 'horizon-zero-dawn', 'title' => 'Horizon Zero Dawn', 'release_year' => 2017, 'developer' => 'Guerrilla Games', 'genres' => ['Action RPG', 'Open World'], 'cover_url' => '/covers/horizon-zero-dawn.jpg', 'rating' => 4.4],
            ['slug' => 'okami', 'title' => 'Ōkami', 'release_year' => 2006, 'developer' => 'Clover Studio', 'genres' => ['Action-Adventure', 'Mythology'], 'cover_url' => '/covers/okami.jpg', 'rating' => 4.7],
            ['slug' => 'final-fantasy-x', 'title' => 'Final Fantasy X', 'release_year' => 2001, 'developer' => 'Square', 'genres' => ['JRPG', 'Fantasy'], 'cover_url' => '/covers/final-fantasy-x.jpg', 'rating' => 4.6],
            ['slug' => 'final-fantasy-xii', 'title' => 'Final Fantasy XII', 'release_year' => 2006, 'developer' => 'Square Enix', 'genres' => ['JRPG', 'Open World'], 'cover_url' => '/covers/final-fantasy-xii.jpg', 'rating' => 4.4],
            ['slug' => 'kingdom-hearts', 'title' => 'Kingdom Hearts', 'release_year' => 2002, 'developer' => 'Square', 'genres' => ['Action RPG', 'Crossover'], 'cover_url' => '/covers/kingdom-hearts.jpg', 'rating' => 4.5],
            ['slug' => 'metal-gear-solid-3', 'title' => 'Metal Gear Solid 3: Snake Eater', 'release_year' => 2004, 'developer' => 'Konami', 'genres' => ['Stealth', 'Action'], 'cover_url' => '/covers/metal-gear-solid.jpg', 'rating' => 4.8],
            ['slug' => 'devil-may-cry-3', 'title' => 'Devil May Cry 3', 'release_year' => 2005, 'developer' => 'Capcom', 'genres' => ['Action', 'Hack & Slash'], 'cover_url' => '/covers/devil-may-cry.jpg', 'rating' => 4.5],
            ['slug' => 'gta-san-andreas', 'title' => 'Grand Theft Auto: San Andreas', 'release_year' => 2004, 'developer' => 'Rockstar Games', 'genres' => ['Open World', 'Action'], 'cover_url' => '/covers/gta-san-andreas.jpg', 'rating' => 4.7],
            ['slug' => 'gta-vice-city', 'title' => 'Grand Theft Auto: Vice City', 'release_year' => 2002, 'developer' => 'Rockstar Games', 'genres' => ['Open World', 'Action'], 'cover_url' => '/covers/gta-vice-city.jpg', 'rating' => 4.6],
            ['slug' => 'sonic-adventure-2', 'title' => 'Sonic Adventure 2', 'release_year' => 2001, 'developer' => 'Sonic Team', 'genres' => ['Platformer', 'Speedrun'], 'cover_url' => '/covers/sonic-adventure-2.jpg', 'rating' => 4.3],
            ['slug' => 'katamari-damacy', 'title' => 'Katamari Damacy', 'release_year' => 2004, 'developer' => 'Namco', 'genres' => ['Puzzle', 'Arcade'], 'cover_url' => '/covers/katamari-damacy.jpg', 'rating' => 4.4],
            ['slug' => 'persona-4-golden', 'title' => 'Persona 4 Golden', 'release_year' => 2008, 'developer' => 'Atlus', 'genres' => ['JRPG', 'Social Sim'], 'cover_url' => '/covers/persona-4-golden.jpg', 'rating' => 4.8],
            ['slug' => 'psychonauts', 'title' => 'Psychonauts', 'release_year' => 2005, 'developer' => 'Double Fine', 'genres' => ['Platformer', 'Adventure'], 'cover_url' => '/covers/psychonauts.jpg', 'rating' => 4.5],
            ['slug' => 'star-wars-battlefront-2', 'title' => 'Star Wars: Battlefront II', 'release_year' => 2005, 'developer' => 'Pandemic Studios', 'genres' => ['Action', 'Multiplayer'], 'cover_url' => '/covers/star-wars-battlefront-2.jpg', 'rating' => 4.4],
            ['slug' => 'bully', 'title' => 'Bully', 'release_year' => 2006, 'developer' => 'Rockstar Vancouver', 'genres' => ['Open World', 'Adventure'], 'cover_url' => '/covers/bully.jpg', 'rating' => 4.2],
            ['slug' => 'hitman-blood-money', 'title' => 'Hitman: Blood Money', 'release_year' => 2006, 'developer' => 'IO Interactive', 'genres' => ['Stealth', 'Action'], 'cover_url' => '/covers/hitman-blood-money.jpg', 'rating' => 4.4],
            ['slug' => 'max-payne-2', 'title' => 'Max Payne 2', 'release_year' => 2003, 'developer' => 'Remedy Entertainment', 'genres' => ['Action', 'Noir'], 'cover_url' => '/covers/max-payne-2.jpg', 'rating' => 4.3],
            ['slug' => 'onimusha-warlords', 'title' => 'Onimusha: Warlords', 'release_year' => 2001, 'developer' => 'Capcom', 'genres' => ['Action', 'Historical'], 'cover_url' => '/covers/onimusha.jpg', 'rating' => 4.1],
            ['slug' => 'tomb-raider-legend', 'title' => 'Tomb Raider: Legend', 'release_year' => 2006, 'developer' => 'Crystal Dynamics', 'genres' => ['Action-Adventure', 'Exploration'], 'cover_url' => '/covers/tomb-raider-legend.jpg', 'rating' => 4.0],
        ];

        $summaries = [
            'elden-ring' => 'Un monde ouvert écrit à quatre mains avec George R. R. Martin, hostile et magnifique.',
            'red-dead-redemption-2' => 'La fin du Far West racontée comme une tragédie lente et somptueuse.',
            'cyberpunk-2077' => 'Night City, ses néons et ses promesses brisées, dans un RPG à la première personne.',
            'the-witcher-3' => 'Une chasse au monstre devenue la référence du RPG narratif en monde ouvert.',
            'hollow-knight' => "Un royaume d'insectes dessiné à la main, exigeant et mélancolique.",
            'god-of-war' => "Kratos quitte l'Olympe pour les mythes nordiques et apprend à être père.",
            'persona-5-royal' => 'Lycéens le jour, voleurs fantômes la nuit : le JRPG le plus stylisé de sa génération.',
            'hades' => "Fuir les Enfers encore et encore, jusqu'à ce que la famille accepte de parler.",
            'baldurs-gate-3' => 'Un bac à sable de jeu de rôle où presque toutes vos idées ont une réponse.',
            'sekiro' => 'Un duel au sabre permanent dans un Japon Sengoku fantasmé.',
            'disco-elysium' => 'Une enquête politique et intime menée contre son propre cerveau.',
            'celeste' => 'Gravir une montagne, pixel par pixel, pour affronter son anxiété.',
            'resident-evil-4' => "Le remake d'un classique de l'horreur, plus nerveux et plus sombre.",
            'spider-man-remastered' => "Le plaisir brut de traverser Manhattan au bout d'un fil.",
            'death-stranding' => "Relier une Amérique brisée, un colis et un pas après l'autre.",
            'monster-hunter-world' => 'Préparer la chasse, apprendre la bête, recommencer avec de meilleures bottes.',
            'portal-2' => "Deux portails, une IA rancunière et la meilleure écriture d'un jeu de puzzle.",
            'dark-souls-3' => 'Un monde en cendres où chaque victoire se paie en patience.',
            'nier-automata' => 'Des androïdes se demandent ce qui reste de nous, entre deux combats virtuoses.',
            'outer-wilds' => 'Vingt-deux minutes pour comprendre un système solaire condamné.',
            'stardew-valley' => 'Quitter le bureau pour une ferme, des voisins et quatre saisons qui défilent.',
            'it-takes-two' => 'Une thérapie de couple déguisée en terrain de jeu à deux manettes.',
            'subnautica' => 'Descendre toujours plus bas dans un océan extraterrestre, malgré la peur.',
            'horizon-zero-dawn' => 'Chasser des machines dans un monde où la nature a repris ses droits.',
            'okami' => 'Un pinceau divin repeint un Japon de légende, estampe après estampe.',
            'final-fantasy-x' => 'Un pèlerinage vers une fin annoncée, avec le blitzball comme respiration.',
            'final-fantasy-xii' => 'Ivalice, ses intrigues politiques et des combats que l’on programme.',
            'kingdom-hearts' => 'Disney et Final Fantasy dans le même rêve, clé en main.',
            'metal-gear-solid-3' => 'La jungle, un carton et la plus belle leçon d’infiltration jamais écrite.',
            'devil-may-cry-3' => 'Dante découvre le style, et le combo devient une signature.',
            'gta-san-andreas' => 'Trois villes, un vélo et toute une mythologie des années 90.',
            'gta-vice-city' => 'Néons roses, chemises à fleurs et radio FM en boucle.',
            'sonic-adventure-2' => 'Du bleu, de la vitesse et un refrain dont on ne se débarrasse pas.',
            'katamari-damacy' => 'Rouler une boule jusqu’à avaler le monde, sur la musique la plus joyeuse qui soit.',
            'persona-4-golden' => 'Une enquête dans la télévision, entre cours de lycée et nuits de brouillard.',
            'psychonauts' => 'Une colonie de vacances pour espions psychiques, et des cerveaux à visiter.',
            'star-wars-battlefront-2' => 'Les grandes batailles de la saga, du sol au cockpit.',
            'bully' => 'Un internat, des brutes et une année scolaire à survivre.',
            'hitman-blood-money' => 'Un contrat, mille approches et un accident parfaitement maquillé.',
            'max-payne-2' => 'Du ralenti, de la pluie et un roman noir qui ne s’excuse pas.',
            'onimusha-warlords' => 'Le Japon féodal hanté, sabre au clair et démons en embuscade.',
            'tomb-raider-legend' => 'Lara retrouve son élan, entre ruines, motos et énigmes.',
        ];

        $backgrounds = [
            'elden-ring' => '/backgrounds/elden-ring.jpg',
            'red-dead-redemption-2' => '/backgrounds/red-dead-redemption-2.jpg',
            'cyberpunk-2077' => '/backgrounds/cyberpunk-2077.jpg',
            'the-witcher-3' => '/backgrounds/the-witcher-3.jpg',
            'hollow-knight' => '/backgrounds/hollow-knight.jpg',
            'god-of-war' => '/backgrounds/god-of-war.jpg',
        ];

        foreach ($games as $game) {
            Game::updateOrCreate(
                ['slug' => $game['slug']],
                array_merge($game, [
                    'background_url' => $backgrounds[$game['slug']] ?? null,
                    'summary' => $summaries[$game['slug']] ?? null,
                ]),
            );
        }
    }
}
