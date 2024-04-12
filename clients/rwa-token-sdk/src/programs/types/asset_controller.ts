/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/asset_controller.json`.
 */
export type AssetControllerIdlType = {
  "address": "acpcFrzEYKjVLvZGWueTV8vyDjhu3oKC7sN38QELLan",
  "metadata": {
    "name": "asset_controller",
    "version": "0.0.1",
    "spec": "0.1.0",
    "description": "The Asset Controller Program (ACP) enables core asset management functionality for newly issued assets, including transfer controls and transaction privacy."
  },
  "instructions": [
    {
      "name": "close_token_account",
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
          "name": "asset_mint"
        },
        {
          "name": "token_account",
          "writable": true
        },
        {
          "name": "token_program",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "associated_token_program",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": []
    },
    {
      "name": "create_asset_controller",
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
          "name": "asset_mint",
          "writable": true,
          "signer": true
        },
        {
          "name": "asset_controller",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "asset_mint"
              }
            ]
          }
        },
        {
          "name": "extra_metas_account",
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
                "path": "asset_mint"
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "token_program",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "CreateAssetControllerArgs"
            }
          }
        }
      ]
    },
    {
      "name": "create_token_account",
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
          "name": "asset_mint"
        },
        {
          "name": "token_account",
          "writable": true
        },
        {
          "name": "tracker_account",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "asset_mint"
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "token_program",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "associated_token_program",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": []
    },
    {
      "name": "execute_transaction",
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
          "name": "source_account"
        },
        {
          "name": "asset_mint"
        },
        {
          "name": "destination_account"
        },
        {
          "name": "owner_delegate"
        },
        {
          "name": "extra_metas_account",
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
                "path": "asset_mint"
              }
            ]
          }
        },
        {
          "name": "policy_engine",
          "address": "po1cPf1eyUJJPqULw4so3T4JU9pdFn83CDyuLEKFAau"
        },
        {
          "name": "policy_engine_account"
        },
        {
          "name": "identity_registry",
          "address": "idtynCMYbdisCTv4FrCWPSQboZb1uM4TV2cPi79yxQf"
        },
        {
          "name": "identity_registry_account"
        },
        {
          "name": "identity_account",
          "writable": true
        },
        {
          "name": "tracker_account",
          "writable": true
        },
        {
          "name": "policy_account"
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
      "name": "issue_tokens",
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
          "name": "asset_mint",
          "writable": true
        },
        {
          "name": "token_account",
          "writable": true
        },
        {
          "name": "token_program",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "IssueTokensArgs"
            }
          }
        }
      ]
    },
    {
      "name": "void_tokens",
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
          "name": "asset_mint",
          "writable": true
        },
        {
          "name": "token_account",
          "writable": true
        },
        {
          "name": "token_program",
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
      "name": "AssetControllerAccount",
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
      "name": "IdentityAccount",
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
      "name": "IdentityRegistryAccount",
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
      "name": "PolicyAccount",
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
      "name": "PolicyEngineAccount",
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
      "name": "TrackerAccount",
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
      "name": "TransferMintNotApproved",
      "msg": "Transfer hasnt been approved for the asset mint"
    },
    {
      "code": 6001,
      "name": "TransferFromNotApproved",
      "msg": "Transfer hasnt been approved for from account"
    },
    {
      "code": 6002,
      "name": "TransferToNotApproved",
      "msg": "Transfer hasnt been approved for to account"
    },
    {
      "code": 6003,
      "name": "TransferAmountNotApproved",
      "msg": "Transfer hasnt been approved for the specified amount"
    },
    {
      "code": 6004,
      "name": "InvalidPolicyAccount",
      "msg": "Invalid policy account passed"
    },
    {
      "code": 6005,
      "name": "TransferSlotNotApproved",
      "msg": "Invalid slot for approve account"
    },
    {
      "code": 6006,
      "name": "TransferHistoryFull",
      "msg": "Transfer history is full"
    },
    {
      "code": 6007,
      "name": "Unauthorized",
      "msg": "Unauthorized"
    }
  ],
  "types": [
    {
      "name": "AssetControllerAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "asset_mint",
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
      "name": "ComparisionType",
      "repr": {
        "kind": "rust"
      },
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Or"
          },
          {
            "name": "And"
          }
        ]
      }
    },
    {
      "name": "CreateAssetControllerArgs",
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
      "name": "IdentityAccount",
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
            "name": "identity_registry",
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
      "name": "IdentityFilter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "identity_levels",
            "type": {
              "array": [
                "u8",
                10
              ]
            }
          },
          {
            "name": "comparision_type",
            "type": {
              "defined": {
                "name": "ComparisionType"
              }
            }
          }
        ]
      }
    },
    {
      "name": "IdentityRegistryAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "asset_mint",
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
      "name": "IssueTokensArgs",
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
      "name": "Policy",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "hash",
            "type": "string"
          },
          {
            "name": "policy_type",
            "type": {
              "defined": {
                "name": "PolicyType"
              }
            }
          },
          {
            "name": "identity_filter",
            "type": {
              "defined": {
                "name": "IdentityFilter"
              }
            }
          }
        ]
      }
    },
    {
      "name": "PolicyAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "policy_engine",
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
                  "name": "Policy"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "PolicyEngineAccount",
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
            "name": "asset_mint",
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
            "name": "max_timeframe",
            "docs": [
              "max timeframe of all the policies"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "PolicyType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "IdentityApproval"
          },
          {
            "name": "TransactionAmountLimit",
            "fields": [
              {
                "name": "limit",
                "type": "u64"
              }
            ]
          },
          {
            "name": "TransactionAmountVelocity",
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
            "name": "TransactionCountVelocity",
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
      "name": "TrackerAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "asset_mint",
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
                  "name": "Transfer"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "Transfer",
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
}