#include "Player.hpp"
#include "../Game.hpp"
std::default_random_engine generator;
std::uniform_int_distribution<int> distribution(0, 255);
auto ranPos = std::bind(distribution, generator);
namespace Collapsa {
    Player::Player(Game* t_p_game, std::string t_socketid, std::string t_username, int t_id, int t_entityid):
        Entity(Health::Options(0, 100), t_p_game, t_entityid),
        socketid(t_socketid),
        username(t_username)
    {
        is = constants::PLAYER::TYPE;
        body = new Body::Circle(32, Position::Overwrite(ranPos(), ranPos()));
        this->id = t_id;
    };
    void Player::populateAABB(int* x1, int* y1, int* x2, int* y2) {
        Position::Overwrite position = body->getPosition();
        *x1 = position.x - 32;
        *y1 = position.y - 32;
        *x2 = position.x + 32;
        *y2 = position.y + 32;
    }
}