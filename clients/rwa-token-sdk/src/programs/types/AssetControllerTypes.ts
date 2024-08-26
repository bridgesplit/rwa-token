/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/asset_controller.json`.
 */
export type AssetController = {
  "address": "acpcFrzEYKjVLvZGWueTV8vyDjhu3oKC7sN38QELLan",
  "metadata": {
    "name": "assetController",
    "version": "0.0.1",
    "spec": "0.1.0",
    "description": "The Asset Controller Program (ACP) enables core asset management functionality for newly issued assets, including transfer controls and transaction privacy."
  },
  "instructions": [
    {
      "name": "burnTokens",
      "docs": [
        "burn shares of the rwa asset"
      ],
      "discriminator": [
        76,
        15,
        51,
        254,
        229,
        215,
        121,
        66
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true
        },
        {
          "name": "assetMint",
          "writable": true
        },
        {
          "name": "tokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "assetMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "closeMintAccount",
      "docs": [
        "close mint account"
      ],
      "discriminator": [
        14,
        121,
        72,
        246,
        96,
        224,
        42,
        162
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "assetMint",
          "writable": true
        },
        {
          "name": "assetController",
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "assetMint"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": []
    },
    {
      "name": "closeTokenAccount",
      "docs": [
        "close a token account"
      ],
      "discriminator": [
        132,
        172,
        24,
        60,
        100,
        156,
        135,
        97
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "owner",
          "signer": true
        },
        {
          "name": "assetMint"
        },
        {
          "name": "tokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "assetMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": []
    },
    {
      "name": "createAssetController",
      "docs": [
        "create an rwa asset"
      ],
      "discriminator": [
        97,
        185,
        6,
        250,
        248,
        242,
        68,
        105
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "authority"
        },
        {
          "name": "assetController",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "assetMint"
              }
            ]
          }
        },
        {
          "name": "assetMint",
          "writable": true,
          "signer": true
        },
        {
          "name": "extraMetasAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  120,
                  116,
                  114,
                  97,
                  45,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                  45,
                  109,
                  101,
                  116,
                  97,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "assetMint"
              }
            ]
          }
        },
        {
          "name": "policyEngineAccount",
          "writable": true
        },
        {
          "name": "identityRegistryAccount",
          "writable": true
        },
        {
          "name": "dataRegistryAccount",
          "writable": true
        },
        {
          "name": "policyEngine",
          "address": "po1cPf1eyUJJPqULw4so3T4JU9pdFn83CDyuLEKFAau"
        },
        {
          "name": "identityRegistry",
          "address": "idtynCMYbdisCTv4FrCWPSQboZb1uM4TV2cPi79yxQf"
        },
        {
          "name": "dataRegistry",
          "address": "dataeP5X1e7XsWN1ovDSEDP5cqaEUnKBmHE5iZhXPVw"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "createAssetControllerArgs"
            }
          }
        }
      ]
    },
    {
      "name": "createTokenAccount",
      "docs": [
        "create a token account"
      ],
      "discriminator": [
        147,
        241,
        123,
        100,
        244,
        132,
        174,
        118
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "owner"
        },
        {
          "name": "assetMint"
        },
        {
          "name": "tokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "assetMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "assetController",
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "assetMint"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "createTokenAccountArgs"
            }
          }
        }
      ]
    },
    {
      "name": "disableMemoTransfer",
      "docs": [
        "memo transfer disable"
      ],
      "discriminator": [
        68,
        156,
        197,
        9,
        43,
        91,
        114,
        19
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true
        },
        {
          "name": "tokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": []
    },
    {
      "name": "freezeTokenAccount",
      "docs": [
        "freeze token account"
      ],
      "discriminator": [
        138,
        168,
        178,
        109,
        205,
        224,
        209,
        93
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "assetMint",
          "writable": true
        },
        {
          "name": "assetController",
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "assetMint"
              }
            ]
          }
        },
        {
          "name": "tokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": []
    },
    {
      "name": "issueTokens",
      "docs": [
        "issue shares of the rwa asset"
      ],
      "discriminator": [
        40,
        207,
        145,
        106,
        249,
        54,
        23,
        179
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "assetMint",
          "writable": true
        },
        {
          "name": "assetController",
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "assetMint"
              }
            ]
          }
        },
        {
          "name": "tokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "args.to"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "assetMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "issueTokensArgs"
            }
          }
        }
      ]
    },
    {
      "name": "revokeTokens",
      "docs": [
        "revoke shares of the rwa asset"
      ],
      "discriminator": [
        215,
        42,
        15,
        134,
        173,
        80,
        33,
        21
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "assetMint",
          "writable": true
        },
        {
          "name": "assetController",
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "assetMint"
              }
            ]
          }
        },
        {
          "name": "authorityTokenAccount",
          "writable": true
        },
        {
          "name": "revokeTokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "thawTokenAccount",
      "docs": [
        "thaw token account"
      ],
      "discriminator": [
        199,
        172,
        96,
        93,
        244,
        252,
        137,
        171
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "assetMint",
          "writable": true
        },
        {
          "name": "assetController",
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "assetMint"
              }
            ]
          }
        },
        {
          "name": "tokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": []
    },
    {
      "name": "updateInterestBearingMintRate",
      "docs": [
        "interest bearing mint rate update"
      ],
      "discriminator": [
        29,
        174,
        109,
        163,
        227,
        75,
        2,
        144
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "assetMint",
          "writable": true
        },
        {
          "name": "assetController",
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "assetMint"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "rate",
          "type": "i16"
        }
      ]
    },
    {
      "name": "updateMetadata",
      "docs": [
        "edit metadata of the rwa asset"
      ],
      "discriminator": [
        170,
        182,
        43,
        239,
        97,
        78,
        225,
        186
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "assetMint",
          "writable": true
        },
        {
          "name": "assetController",
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "assetMint"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "updateAssetMetadataArgs"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "assetControllerAccount",
      "discriminator": [
        70,
        136,
        149,
        138,
        12,
        87,
        52,
        105
      ]
    }
  ],
  "events": [
    {
      "name": "assetMetadataEvent",
      "discriminator": [
        90,
        19,
        200,
        229,
        103,
        82,
        218,
        16
      ]
    },
    {
      "name": "extensionMetadataEvent",
      "discriminator": [
        22,
        198,
        253,
        69,
        234,
        122,
        248,
        117
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "transferMintNotApproved",
      "msg": "Transfer hasnt been approved for the asset mint"
    },
    {
      "code": 6001,
      "name": "transferFromNotApproved",
      "msg": "Transfer hasnt been approved for from account"
    },
    {
      "code": 6002,
      "name": "transferToNotApproved",
      "msg": "Transfer hasnt been approved for to account"
    },
    {
      "code": 6003,
      "name": "transferAmountNotApproved",
      "msg": "Transfer hasnt been approved for the specified amount"
    },
    {
      "code": 6004,
      "name": "invalidPolicyAccount",
      "msg": "Invalid policy account passed"
    },
    {
      "code": 6005,
      "name": "transferSlotNotApproved",
      "msg": "Invalid slot for approve account"
    },
    {
      "code": 6006,
      "name": "transferHistoryFull",
      "msg": "Transfer history is full"
    },
    {
      "code": 6007,
      "name": "unauthorized",
      "msg": "unauthorized"
    },
    {
      "code": 6008,
      "name": "invalidPdaPassedIn",
      "msg": "Pda passed in for transfer is wrong"
    },
    {
      "code": 6009,
      "name": "invalidCpiTransferProgram",
      "msg": "Invalid cpi program in transfer"
    },
    {
      "code": 6010,
      "name": "invalidCpiTransferAmount",
      "msg": "Invalid cpi amount in transfer"
    },
    {
      "code": 6011,
      "name": "invalidCpiTransferMint",
      "msg": "Invalid cpi mint in transfer"
    }
  ],
  "types": [
    {
      "name": "assetControllerAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "assetMint",
            "docs": [
              "mint pubkey"
            ],
            "type": "pubkey"
          },
          {
            "name": "authority",
            "docs": [
              "authority has the ability to change delegate, freeze token accounts, etc."
            ],
            "type": "pubkey"
          },
          {
            "name": "delegate",
            "docs": [
              "delegate has the ability to generate tranasction approval accounts,",
              "by default points to self, which allows any programs to generate an approval account",
              "update to any other account to control cpis"
            ],
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "assetMetadataEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "string"
          },
          {
            "name": "name",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "symbol",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "uri",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "decimals",
            "type": {
              "option": "u8"
            }
          }
        ]
      }
    },
    {
      "name": "createAssetControllerArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "decimals",
            "type": "u8"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "delegate",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "interestRate",
            "type": {
              "option": "i16"
            }
          }
        ]
      }
    },
    {
      "name": "createTokenAccountArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "memoTransfer",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "extensionMetadataEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "type": "string"
          },
          {
            "name": "extensionType",
            "type": "u8"
          },
          {
            "name": "metadata",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "issueTokensArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "to",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "updateAssetMetadataArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "symbol",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "uri",
            "type": {
              "option": "string"
            }
          }
        ]
      }
    }
  ]
};
