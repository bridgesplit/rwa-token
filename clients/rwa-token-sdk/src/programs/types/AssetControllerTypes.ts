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
          "writable": true
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
          "name": "assetMint",
          "writable": true,
          "signer": true
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
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
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
          "writable": true
        },
        {
          "name": "trackerAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "assetMint"
              },
              {
                "kind": "account",
                "path": "owner"
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
        }
      ],
      "args": []
    },
    {
      "name": "executeTransaction",
      "docs": [
        "execute transfer hook"
      ],
      "discriminator": [
        105,
        37,
        101,
        197,
        75,
        251,
        102,
        26
      ],
      "accounts": [
        {
          "name": "sourceAccount"
        },
        {
          "name": "assetMint"
        },
        {
          "name": "destinationAccount"
        },
        {
          "name": "ownerDelegate"
        },
        {
          "name": "extraMetasAccount",
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
          "name": "policyEngine",
          "address": "po1cPf1eyUJJPqULw4so3T4JU9pdFn83CDyuLEKFAau"
        },
        {
          "name": "policyEngineAccount"
        },
        {
          "name": "identityRegistry",
          "address": "idtynCMYbdisCTv4FrCWPSQboZb1uM4TV2cPi79yxQf"
        },
        {
          "name": "identityRegistryAccount"
        },
        {
          "name": "identityAccount",
          "writable": true
        },
        {
          "name": "trackerAccount",
          "writable": true
        },
        {
          "name": "policyAccount"
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
          "name": "tokenAccount",
          "writable": true
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
      "name": "voidTokens",
      "docs": [
        "void shares of the rwa asset"
      ],
      "discriminator": [
        101,
        147,
        63,
        157,
        106,
        103,
        119,
        74
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
    },
    {
      "name": "identityAccount",
      "discriminator": [
        194,
        90,
        181,
        160,
        182,
        206,
        116,
        158
      ]
    },
    {
      "name": "identityRegistryAccount",
      "discriminator": [
        154,
        254,
        118,
        4,
        115,
        36,
        125,
        78
      ]
    },
    {
      "name": "policyAccount",
      "discriminator": [
        218,
        201,
        183,
        164,
        156,
        127,
        81,
        175
      ]
    },
    {
      "name": "policyEngineAccount",
      "discriminator": [
        124,
        85,
        205,
        80,
        2,
        18,
        26,
        45
      ]
    },
    {
      "name": "trackerAccount",
      "discriminator": [
        83,
        95,
        166,
        148,
        57,
        30,
        90,
        210
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
      "name": "comparisionType",
      "repr": {
        "kind": "rust"
      },
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "or"
          },
          {
            "name": "and"
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
          }
        ]
      }
    },
    {
      "name": "identityAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "docs": [
              "version of the account"
            ],
            "type": "u8"
          },
          {
            "name": "identityRegistry",
            "docs": [
              "identity registry to which the account belongs"
            ],
            "type": "pubkey"
          },
          {
            "name": "owner",
            "docs": [
              "owner of the identity account"
            ],
            "type": "pubkey"
          },
          {
            "name": "levels",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "identityFilter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "identityLevels",
            "type": {
              "array": [
                "u8",
                10
              ]
            }
          },
          {
            "name": "comparisionType",
            "type": {
              "defined": {
                "name": "comparisionType"
              }
            }
          }
        ]
      }
    },
    {
      "name": "identityRegistryAccount",
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
              "corresponding asset mint"
            ],
            "type": "pubkey"
          },
          {
            "name": "authority",
            "docs": [
              "authority to manage the registry"
            ],
            "type": "pubkey"
          },
          {
            "name": "delegate",
            "docs": [
              "registry delegate"
            ],
            "type": "pubkey"
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
      "name": "policy",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "hash",
            "type": "string"
          },
          {
            "name": "policyType",
            "type": {
              "defined": {
                "name": "policyType"
              }
            }
          },
          {
            "name": "identityFilter",
            "type": {
              "defined": {
                "name": "identityFilter"
              }
            }
          }
        ]
      }
    },
    {
      "name": "policyAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "policyEngine",
            "docs": [
              "Engine account that the policy belongs to"
            ],
            "type": "pubkey"
          },
          {
            "name": "policies",
            "docs": [
              "Different policies that can be applied to the policy account"
            ],
            "type": {
              "vec": {
                "defined": {
                  "name": "policy"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "policyEngineAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "docs": [
              "version"
            ],
            "type": "u8"
          },
          {
            "name": "assetMint",
            "docs": [
              "asset mint"
            ],
            "type": "pubkey"
          },
          {
            "name": "authority",
            "docs": [
              "authority of the registry"
            ],
            "type": "pubkey"
          },
          {
            "name": "delegate",
            "docs": [
              "policy delegate"
            ],
            "type": "pubkey"
          },
          {
            "name": "maxTimeframe",
            "docs": [
              "max timeframe of all the policies"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "policyType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "identityApproval"
          },
          {
            "name": "transactionAmountLimit",
            "fields": [
              {
                "name": "limit",
                "type": "u64"
              }
            ]
          },
          {
            "name": "transactionAmountVelocity",
            "fields": [
              {
                "name": "limit",
                "type": "u64"
              },
              {
                "name": "timeframe",
                "type": "i64"
              }
            ]
          },
          {
            "name": "transactionCountVelocity",
            "fields": [
              {
                "name": "limit",
                "type": "u64"
              },
              {
                "name": "timeframe",
                "type": "i64"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "trackerAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "assetMint",
            "type": "pubkey"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "transfers",
            "type": {
              "vec": {
                "defined": {
                  "name": "transfer"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "transfer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
