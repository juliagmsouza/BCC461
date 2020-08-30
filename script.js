window.onload = function() {
    var tabuleirojogo = [
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0]
  ];

    var pecas = [];
    var casas = [];

    var dist = function (x1, y1, x2, y2) {
        return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
    }

    function Peca (item, posicao){

    this.permitidomover = true;
    this.item = item;
    this.posicao = posicao;
    this.jogador = '';

    if (this.item.attr("id") < 12)
        this.jogador = 1;
    else this.jogador =2;

    this.rainha =false();
    this.fazrainha = function (){
        this.item.css("backgroundImage", "url('img/king" + this.player + ".png')");
        this.rainha = true;
    }

    this.mover = function (casa){
        this.item.removeClass('selected');
        if (!Tabuleiro.casavalida(casa.posicao[0], casa.posicao[1])) return false;
        if (this.jogador == 1 && this.rainha == false){
            if(casa.posicao[0] < this.posicao[0]) return false;
        }
        else if ( this.jogador == 2 && this.rainha == false){
            if ( casa.posicao[0] > this.posicao[0]) return false;
        }

        Tabuleiro.tabuleiro[this.posicao[0]][this.posicao[1]] = 0;
        Tabuleiro.tabuleiro[casa.posicao[0]][casa.posicao[1]] = this.jogador;
        this.posicao = [casa.posicao[0],casa.posicao[1]];

        this.item.css('top', Tabuleiro.dicionario[this.posicao[0]]);
        this.item.css('left', Tabuleiro.dicionario[this.posicao[1]]);

        if(!this.rainha && (this.posicao[0] == 0 || this.posicao[0] ==7))
            this.fazrainha();
            return true;
    }
    
    this.checarpulos = function () {
        return (this.podecapturaradversario([this.posicao[0] + 2, this.posicao[1] + 2]) ||
          this.podecapturaradversario([this.posicao[0] + 2, this.posicao[1] - 2]) ||
          this.podecapturaradversario([this.posicao[0] - 2, this.posicao[1] + 2]) ||
          this.podecapturaradversario([this.posicao[0] - 2, this.posicao[1] - 2]))
      };

      this.podecapturaradversario = function (novaposicao){
          var dx = novaposicao[1] - this.posicao[1];
          var dy = novaposicao[0] - this.posicao[0];

          if (this.jogador == 1 && this.rainha == false){
            if(casa.posicao[0] < this.posicao[0]) return false;
        }
        else if ( this.jogador == 2 && this.rainha == false){
            if ( casa.posicao[0] > this.posicao[0]) return false;
        }

        if (novaposicao[0] > 7 || novaposicao [1] > 7 || novaposicao [0] <0 || novaposicao [1] <0) return false;
        var checarcasax = this.posicao[1] + dx / 2;
        var checarcasay = this.posicao[0] + dy / 2;
        if (checarcasax > 7 || checarcasay > 7 || checarasay < 0 || checarcasay < 0) return false;

        if(!Tabuleiro.casavalida(checarcasay, checarcasax) && Tabuleiro.casavalida(novaposicao[0], novaposicao[1])){
        
        for(let i_peca in pecas){
            if(pieces[i_peca].posicao[0] == checarcasay && pecas[i_peca].posicao[1] == checarcasax){
                if (this.jogador != pecas[i_peca].jogador){
                    return pecas[i_peca];
                }
            }
        }

      }
      return false;
    };

    this.capturaradversario = function(casa){
        var removerpeca = this.podecapturaradversario(casa.posicao);
        if(removerpeca){
            removerpeca.remove();
            return true;
        }
        return false;
    }

    this.remove = function(){
        this.item.css ("display", "none");
        if(this.player == 1){
            $('#jogador2').append("<div class='pecacapturada'></div");
            Tabuleiro.placar.jogador2 += 1;
        }
        if(this.player == 2){
            $('#jogador1').append("<div class='pecacapturada'></div");
            Tabuleiro.placar.jogador1 += 1;
        }

        Tabuleiro.tabuleiro[this.posicao[0]][this.posocao[1]]=0;
        this.posicao = [];
        var Vencedor = Tabuleiro.checavencedor();
        if(vencedor){
            $('#vencedor').html("Jogador" + vencedor + "venceu");
        }
    }

    }

    function Casa(item, posicao) {
        this.item = item;
        this.posicao = posicao;
        this.alcance = function (peca){
            for(let i of pecas)
              if (i.posicao[0] == this.posocao[0] && i.posicao[1] == this.posicao[1]) return 'invalido';
            if(!peca.rainha && peca.jogador == 1 && this.posicao[0] < peca.posicao[0]) return 'invalido';
            if(!peca.rainha && peca.jogador == 2 && this.posicao[0] > peca.posicao[0]) return 'invalido';
            if(dist(this.posicao[0], this.posicao[1], peca.posicao[0], peca.posicao[1]) == Math.sqrt(2)){
                return 'regular';
            } else if (dist(this.posicao[0], this.posicao[1], peca.posicao[0], peca.posicao[1]) == 2* Math.sqrt(2)){
                return 'salto'
            }
        };
    }

    var Tabuleiro = {
        tabuleiro: tabuleirojogo,
        placar: {
            jogador1: 0,
            jogador2: 0
        },
        jogadoratual: 1,
        capturaobrigatoria: false,
        capturamultipla: false,
        casasitem: $('div.casas'),
        dicionario: ["0vmin", "10vmin", "20vmin", "30vmin", "40vmin", "50vmin", "60vmin", "70vmin", "80vmin", "90vmin"],

        iniciar: function() {
            var contarpecas = 0;
            var contarcasas = 0;
            for(let linha in this.tabuleiro){
                for(let coluna in this.tabuleiro[linha]){
                    if (linha % 2 == 1){
                        if (coluna % 2 == 0){
                            contarcasas = this.exibircasa(linha, coluna, contarcasas)
                        }
                    } else {
                        if (coluna % 2 == 1){
                            contarcasas = this.exibircasa(linha, coluna, contarcasas)
                        }
                    }
                    if( this.tabuleiro[linha][coluna] == 1){
                        contarpecas = this.exibirpecas(1, linha, coluna, contarpecas)
                    } else if (this.tabuleiro[linha][coluna] == 2){
                        contarpecas = this.exibirpecas(2, linha, coluna, contarpecas)
                    }
                }
            }
        },
        exibircasa: function (linha, coluna, contarcasas){
            this.casasitem.append("<div class='casa' id='casa" + contarcasas + "'style='top:" + this.dicionario[linha] + ";left:" + this.dicionario[coluna] + ";'></div");
            casas[contarcasas]=new Casa($("#casa" + contarcasas), [parseInt(inha), parseInt(coluna)]);
            return contarcasas +1
        },

        exibirpecas: function (numerojogador, linha, coluna, contarpecas){
            $(`.jogador${numerojogador}pecas`).append("<div class='peca' id='" + contarpecas + "' style='top:" + this.dicionario[linha] + ";left:" + this.dicionario[coluna] + ";'></div>");
            pecas[contarpecas] = new Peca($("#" + contarpecas), [parseInt(linha), parseInt(coluna)]);
            return contarpecas + 1;
        },

        casavalida: function (linha, coluna) {
            if (linha < 0 || linha > 7 || coluna < 0 || coluna > 7) return false;
            if (this.tabuleiro[linha][coluna] == 0){
                return true;
            }
            return false;
        },

        
    }

    }
