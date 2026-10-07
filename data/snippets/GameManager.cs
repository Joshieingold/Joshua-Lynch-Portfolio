using Core.Entities;
using Core.State;
using Core.Factories;
using GameData;

namespace Core.Managers
{
    public class GameManager // Manages the session the entire game will be using.
    {
        ///////////////
        // Constants //
        ///////////////
        public const int GAME_ROUNDS = 8;

        /////////////////
        // Constructor //
        /////////////////
        public GameManager(string playerName, bool gender)
        {
            CurrentPlayer = new Player(playerName, gender);
            CurrentState = GameState.Battle; // Starts as a battle
            Round = 1;
            CurrentShopManager = new ShopManager();
            AllEnemies = EnemyFactory.RequestXNewEnemies(GAME_ROUNDS);
            AllEnemies.Sort(); // Sorted for difficulty
        }

        ////////////////
        // Properties //
        ////////////////
        public GameState CurrentState { get; private set; } 
        public Player CurrentPlayer { get; set; } 
        public List<Enemy> AllEnemies { get; set; } // Contains all enemies for each round
        public BattleManager CurrentBattleManager { get; set; } 
        public ShopManager CurrentShopManager { get; set; }
        public int Round { get; set; }

        /////////////
        // Methods //
        /////////////
        public Enemy GetCurrentEnemy() // Gets reference to the enemy for the upcoming round.
        {
            return AllEnemies[Round - 1];
        }
        public void UpdateState(GameState newState) // Creates appropriate new managers for game state.
        {
            if (newState == GameState.Battle)
            {
                CurrentState = GameState.Battle;
                CurrentBattleManager = new BattleManager(CurrentPlayer, GetCurrentEnemy());
            }
            else if (newState == GameState.Shop)
            {
                CurrentState = GameState.Shop;
                CurrentShopManager = new ShopManager();
            }
            else if (newState == GameState.Victory)
            {
                CurrentState = GameState.Victory;
                UploadGame();

            }
            else if (newState == GameState.Defeat)
            {
                CurrentState = GameState.Defeat;
                UploadGame();
            }
        }
        private void UploadGame() // Saves game data to text document for record keeping.
        {
            string newRecord = $"{CurrentState} | {CurrentPlayer.Name} | {DateTime.Now} | Round {Round} " + Environment.NewLine;
            string path = DataPasser.GeneralLocation() + "GameRecord.txt";
            File.AppendAllText(path, newRecord);
        }
        public void OnShopOver(Player updatedPlayer) // Updates round when window is closed.
        {
            CurrentPlayer = updatedPlayer;
            Round++;
            CurrentShopManager = new ShopManager();
        }
    }
