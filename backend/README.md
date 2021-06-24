# Lisk Cards - Backend

### Requirements

- Node v12.21.0

### Installation

```
git clone https://github.com/Lemii/collectibles
cd collectibles/backend/
npm i
```

### Usage

#### Start Node

```
./bin/run start
```

### API

#### Address

ws://localhost:8080/ws

### Actions

**getAllCards**

```ts
client.invoke('lcApi:getAllCards');
```

**getCardsOnSale**

```ts
client.invoke('lcApi:getCardsOnSale');
```

**getGraveyard**

```ts
client.invoke('lcApi:getGraveyard');
```

**getCardById**

```ts
client.invoke('lcApi:getCardById', { id: 'id' });
```

**getCardsByOwner**

```ts
client.invoke('lcApi:getCardsByOwner', { owner: 'base32Address' });
```

**getCardsOfType**

```ts
client.invoke('lcApi:getCardsOfType', { code: 'cardCode' });
```

**getNewestCard**

```ts
client.invoke('lcApi:getNewestCard');
```

**getStatistics**

```ts
client.invoke('lcApi:getStatistics');
```

### CLI Commands

Use the following command for more info:

```
./bin/run lc
```
