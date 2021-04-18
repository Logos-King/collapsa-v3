#pragma once
#include "../include.hpp"
#include "../Controllers.hpp"
namespace Collapsa {
    class Game;
    class Entity {
    public:
        Health::Controller health;
        Body::IBody* body;
    protected:
        Game * m_p_game;
    public:
        Entity(Health::Options t_healthOptions, Game* t_p_game, int t_entityid): 
            health(t_healthOptions),
            m_p_game(t_p_game),
            entityid(t_entityid)
        {};
        virtual void populateAABB(int*, int*, int*, int*) = 0;
        int id;
        int entityid; 
    };
}